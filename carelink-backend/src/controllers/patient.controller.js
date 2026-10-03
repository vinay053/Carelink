const { Patient, Referral, DiagnosticResult, Medication, Alert } = require('../models');

const getPatients = async (req, res) => {
  try {
    const { search, district, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { abhaId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (district) {
      query['address.district'] = district;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [patients, total] = await Promise.all([
      Patient.find(query)
        .populate('assignedDoctorId', 'name email role')
        .populate('hospitalId', 'name district')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Patient.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const existing = await Patient.findOne({ abhaId: req.body.abhaId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Patient with ABHA ID ${req.body.abhaId} already exists.`
      });
    }

    const patient = await Patient.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: patient
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctorId', 'name email role')
      .populate('hospitalId', 'name district type');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const [referrals, diagnostics, medications, alerts] = await Promise.all([
      Referral.find({ patientId: patient._id }).populate('referringHospitalId targetHospitalId referringDoctorId').sort({ createdAt: -1 }),
      DiagnosticResult.find({ patientId: patient._id }).sort({ orderedAt: -1 }),
      Medication.findOne({ patientId: patient._id }),
      Alert.find({ patientId: patient._id }).sort({ createdAt: -1 })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        patient,
        referrals,
        diagnostics,
        medications,
        alerts
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.status(200).json({ success: true, data: patient });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getPatientTimeline = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const [referrals, diagnostics, medications, alerts] = await Promise.all([
      Referral.find({ patientId }).populate('referringHospitalId targetHospitalId referringDoctorId'),
      DiagnosticResult.find({ patientId }),
      Medication.findOne({ patientId }),
      Alert.find({ patientId })
    ]);

    const timeline = [];

    // Patient creation event
    timeline.push({
      id: `pt_${patient._id}`,
      type: 'patient_registration',
      date: patient.createdAt,
      title: 'Patient Registered in CareLink',
      description: `Registered with ABHA ID ${patient.abhaId} at ${patient.address?.district || 'PHC'}.`,
      severity: 'info',
      category: 'administrative'
    });

    // Referral events & stage transitions
    referrals.forEach(ref => {
      timeline.push({
        id: `ref_init_${ref._id}`,
        type: 'referral_created',
        date: ref.createdAt,
        title: `Referral Created: ${ref.targetSpecialty}`,
        description: `Referred from ${ref.referringHospitalId?.name || 'PHC'} to ${ref.targetHospitalId?.name || 'Hospital'}. Initial risk: ${ref.riskScore} (${ref.riskLevel}).`,
        severity: ref.riskLevel === 'high' ? 'danger' : 'teal',
        category: 'referral',
        refId: ref._id
      });

      if (ref.stageTimestamps && ref.stageTimestamps.length > 0) {
        ref.stageTimestamps.forEach(st => {
          timeline.push({
            id: `ref_stage_${ref._id}_${st.stageIndex}`,
            type: 'referral_stage',
            date: st.completedAt,
            title: `Referral Stage Advanced: ${st.stageName}`,
            description: st.notes || `Progressed to stage ${st.stageIndex}`,
            severity: 'teal',
            category: 'referral',
            refId: ref._id
          });
        });
      }
    });

    // Diagnostic events
    diagnostics.forEach(diag => {
      timeline.push({
        id: `diag_ord_${diag._id}`,
        type: 'diagnostic_ordered',
        date: diag.orderedAt,
        title: `Diagnostic Ordered: ${diag.testName}`,
        description: `Status: ${diag.status}. Classification: ${diag.classification}`,
        severity: diag.classification === 'urgent' ? 'danger' : (diag.classification === 'review_needed' ? 'warning' : 'blue'),
        category: 'diagnostic',
        diagId: diag._id
      });

      if (diag.reviewedAt) {
        timeline.push({
          id: `diag_rev_${diag._id}`,
          type: 'diagnostic_reviewed',
          date: diag.reviewedAt,
          title: `Diagnostic Reviewed: ${diag.testName}`,
          description: `Result value: ${diag.resultValue || 'Report verified'}. ${diag.actionNotes || ''}`,
          severity: 'success',
          category: 'diagnostic',
          diagId: diag._id
        });
      }
    });

    // Medication conflicts
    if (medications && medications.conflicts) {
      medications.conflicts.forEach(conf => {
        timeline.push({
          id: `med_conf_${conf._id}`,
          type: 'medication_conflict',
          date: conf.flaggedAt,
          title: `Drug Conflict Flagged: ${conf.drug1} + ${conf.drug2}`,
          description: conf.explanation,
          severity: conf.severity === 'high' ? 'danger' : 'warning',
          category: 'medication',
          status: conf.status
        });
      });
    }

    // Alerts
    alerts.forEach(alert => {
      timeline.push({
        id: `alert_${alert._id}`,
        type: alert.type,
        date: alert.createdAt,
        title: `Care Alert (${alert.severity.toUpperCase()}): ${alert.type.replace('_', ' ')}`,
        description: alert.message,
        severity: alert.severity === 'critical' || alert.severity === 'high' ? 'danger' : 'warning',
        category: 'alert',
        status: alert.status
      });
    });

    // Sort chronologically oldest to newest
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json({
      success: true,
      data: {
        patient,
        timeline
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
  getPatientTimeline
};
