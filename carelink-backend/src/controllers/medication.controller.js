const axios = require('axios');
const { Medication, Patient, Alert } = require('../models');

// Known clinical drug-drug interactions for offline / fallback safety
const KNOWN_INTERACTION_RULES = [
  {
    pair: ['aspirin', 'warfarin'],
    severity: 'high',
    explanation: 'Co-administration markedly increases the risk of serious gastrointestinal hemorrhage and bleeding events.'
  },
  {
    pair: ['aspirin', 'clopidogrel'],
    severity: 'medium',
    explanation: 'Dual antiplatelet therapy increases bleeding propensity; monitor platelet count and coagulation parameters.'
  },
  {
    pair: ['metformin', 'contrast'],
    severity: 'high',
    explanation: 'Risk of lactic acidosis with iodinated radiographic contrast agents in renal impairment.'
  },
  {
    pair: ['atorvastatin', 'clarithromycin'],
    severity: 'high',
    explanation: 'Macrolides inhibit CYP3A4, substantially increasing statin plasma concentrations and risk of rhabdomyolysis.'
  },
  {
    pair: ['ramipril', 'spironolactone'],
    severity: 'medium',
    explanation: 'Concomitant ACE inhibitor and potassium-sparing diuretic therapy creates elevated risk of life-threatening hyperkalemia.'
  },
  {
    pair: ['atenolol', 'verapamil'],
    severity: 'high',
    explanation: 'Combined beta-blocker and calcium-channel blocker therapy can provoke severe bradycardia, AV block, and cardiac arrest.'
  }
];

function checkPairConflict(drugA = '', drugB = '') {
  const normA = drugA.toLowerCase().trim();
  const normB = drugB.toLowerCase().trim();

  for (const rule of KNOWN_INTERACTION_RULES) {
    const hasA = normA.includes(rule.pair[0]) || normA.includes(rule.pair[1]);
    const hasB = normB.includes(rule.pair[0]) || normB.includes(rule.pair[1]);
    if (hasA && hasB && normA !== normB) {
      return {
        drug1: drugA,
        drug2: drugB,
        severity: rule.severity,
        explanation: rule.explanation,
        source: 'CareLink Deterministic Clinical Interaction Engine'
      };
    }
  }
  return null;
}

const getMedicationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    let record = await Medication.findOne({ patientId }).populate('conflicts.resolvedBy', 'name role');
    if (!record) {
      record = await Medication.create({
        patientId,
        prescriptions: [],
        conflicts: [],
        reconciliationStatus: 'resolved'
      });
    }
    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const reconcileMedications = async (req, res) => {
  try {
    const { prescriptions = [], existingDrugs = [] } = req.body;
    const allDrugs = [...existingDrugs];

    prescriptions.forEach(rx => {
      if (rx.drugs && Array.isArray(rx.drugs)) {
        rx.drugs.forEach(d => {
          if (d.drugName) allDrugs.push(d.drugName);
        });
      }
    });

    const detectedConflicts = [];

    // Pairwise comparison
    for (let i = 0; i < allDrugs.length; i++) {
      for (let j = i + 1; j < allDrugs.length; j++) {
        const conflict = checkPairConflict(allDrugs[i], allDrugs[j]);
        if (conflict) {
          detectedConflicts.push({
            ...conflict,
            flaggedAt: new Date(),
            status: 'unresolved'
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: detectedConflicts.length,
      conflicts: detectedConflicts,
      reconciliationStatus: detectedConflicts.length > 0 ? 'pending' : 'reviewed'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addPrescription = async (req, res) => {
  try {
    const { patientId, prescribedBy, hospitalName, drugs = [] } = req.body;
    let medRecord = await Medication.findOne({ patientId });

    if (!medRecord) {
      medRecord = new Medication({
        patientId,
        prescriptions: [],
        conflicts: []
      });
    }

    // Add new prescription group
    medRecord.prescriptions.push({
      prescribedBy: prescribedBy || (req.user ? req.user.name : 'Attending Physician'),
      prescribedAt: new Date(),
      hospitalName: hospitalName || 'Hospital Care Provider',
      drugs: drugs.map(d => ({
        ...d,
        isActive: true,
        startDate: d.startDate || new Date()
      }))
    });

    // Extract all active drugs for cross-reconciliation
    const activeDrugList = [];
    medRecord.prescriptions.forEach(p => {
      p.drugs.forEach(d => {
        if (d.isActive && d.drugName) activeDrugList.push(d.drugName);
      });
    });

    // Check pairwise conflicts
    const newConflicts = [];
    for (let i = 0; i < activeDrugList.length; i++) {
      for (let j = i + 1; j < activeDrugList.length; j++) {
        const conflict = checkPairConflict(activeDrugList[i], activeDrugList[j]);
        if (conflict) {
          // Avoid duplicate conflict records
          const exists = medRecord.conflicts.some(
            c => (c.drug1 === conflict.drug1 && c.drug2 === conflict.drug2) ||
                 (c.drug1 === conflict.drug2 && c.drug2 === conflict.drug1)
          );
          if (!exists) {
            newConflicts.push({
              ...conflict,
              flaggedAt: new Date(),
              status: 'unresolved'
            });
          }
        }
      }
    }

    if (newConflicts.length > 0) {
      medRecord.conflicts.push(...newConflicts);
      medRecord.reconciliationStatus = 'pending';

      const patient = await Patient.findById(patientId);
      // Create alert for high severity conflicts
      await Alert.create({
        type: 'drug_conflict',
        severity: 'high',
        patientId,
        message: `Medication discrepancy: ${newConflicts.map(c => `${c.drug1} + ${c.drug2}`).join(', ')} flagged for ${patient?.name || 'patient'}. Pharmacist review required.`,
        status: 'active'
      });
    }

    await medRecord.save();

    // Also update patient's currentMedications field
    await Patient.findByIdAndUpdate(patientId, {
      $set: {
        currentMedications: activeDrugList.map(name => ({ drugName: name, isActive: true }))
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription added and medication reconciliation evaluated.',
      data: medRecord,
      conflictsFlagged: newConflicts.length
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resolveConflict = async (req, res) => {
  try {
    const { conflictId } = req.params;
    const { patientId } = req.body;

    const medRecord = await Medication.findOne({ 'conflicts._id': conflictId });
    if (!medRecord) return res.status(404).json({ success: false, message: 'Conflict record not found' });

    const conflict = medRecord.conflicts.id(conflictId);
    if (conflict) {
      conflict.status = 'resolved';
      conflict.resolvedBy = req.user ? req.user._id : null;
      conflict.resolvedAt = new Date();
    }

    // Check if any unresolved conflicts remain
    const hasUnresolved = medRecord.conflicts.some(c => c.status === 'unresolved');
    medRecord.reconciliationStatus = hasUnresolved ? 'pending' : 'resolved';
    await medRecord.save();

    // Auto-resolve drug_conflict alert if all resolved
    if (!hasUnresolved) {
      await Alert.updateMany(
        { patientId: medRecord.patientId, type: 'drug_conflict', status: 'active' },
        { $set: { status: 'resolved', resolvedAt: new Date() } }
      );
    }

    return res.status(200).json({ success: true, message: 'Medication conflict marked as resolved.', data: medRecord });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMedicationsByPatient,
  reconcileMedications,
  addPrescription,
  resolveConflict
};
