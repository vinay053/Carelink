const { DiagnosticResult, Alert, Patient } = require('../models');

const getDiagnostics = async (req, res) => {
  try {
    const { patientId, status, classification } = req.query;
    const query = {};
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    if (classification) query.classification = classification;

    const results = await DiagnosticResult.find(query)
      .populate('patientId', 'name abhaId phone')
      .populate('orderedBy reviewedBy', 'name role')
      .sort({ orderedAt: -1 });

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createDiagnostic = async (req, res) => {
  try {
    const { patientId, testName, resultValue, normalRange, unit, classification, classificationReason, keyFindings } = req.body;
    const orderedBy = req.user ? req.user._id : req.body.orderedBy;

    // Automatic classification heuristic if not specified
    let determinedClass = classification || 'normal';
    let reason = classificationReason || '';
    const findings = keyFindings || [];

    const lowerName = (testName || '').toLowerCase();
    const lowerVal = (resultValue || '').toLowerCase();

    if (lowerName.includes('troponin') || lowerName.includes('d-dimer') || lowerVal.includes('critical') || lowerVal.includes('elevated')) {
      determinedClass = 'urgent';
      reason = 'Critical cardiac biomarker elevation requiring immediate clinical assessment.';
      findings.push('Marked elevation beyond reference threshold');
    } else if (lowerName.includes('creatinine') || lowerName.includes('hba1c') || lowerVal.includes('high')) {
      determinedClass = 'review_needed';
      reason = 'Biochemical parameter outside expected reference range.';
      findings.push('Review recommended for medication dosage calibration');
    }

    const result = await DiagnosticResult.create({
      patientId,
      testName,
      orderedBy,
      orderedAt: new Date(),
      resultValue: resultValue || '',
      normalRange: normalRange || '',
      unit: unit || '',
      status: resultValue ? 'completed' : 'ordered',
      completedAt: resultValue ? new Date() : null,
      classification: determinedClass,
      classificationReason: reason,
      keyFindings: findings
    });

    // If urgent, generate immediate alert
    if (determinedClass === 'urgent' || determinedClass === 'review_needed') {
      const patient = await Patient.findById(patientId);
      await Alert.create({
        type: 'diagnostic_pending',
        severity: determinedClass === 'urgent' ? 'critical' : 'high',
        patientId,
        message: `${determinedClass.toUpperCase()} diagnostic result: ${testName} for ${patient?.name || 'patient'} (${resultValue || 'Awaiting Review'}).`,
        status: 'active',
        assignedTo: orderedBy
      });
    }

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateDiagnosticStatus = async (req, res) => {
  try {
    const { status, actionNotes, resultValue } = req.body;
    const diagnostic = await DiagnosticResult.findById(req.params.id);
    if (!diagnostic) return res.status(404).json({ success: false, message: 'Diagnostic record not found' });

    diagnostic.status = status;
    const now = new Date();

    if (resultValue) diagnostic.resultValue = resultValue;
    if (status === 'completed' && !diagnostic.completedAt) diagnostic.completedAt = now;
    if (status === 'reviewed') {
      diagnostic.reviewedAt = now;
      diagnostic.reviewedBy = req.user ? req.user._id : null;
    }
    if (status === 'patient_informed') diagnostic.patientInformedAt = now;
    if (status === 'action_taken') {
      diagnostic.actionTakenAt = now;
      if (actionNotes) diagnostic.actionNotes = actionNotes;

      // Auto-resolve associated pending diagnostic alerts
      await Alert.updateMany(
        { patientId: diagnostic.patientId, type: 'diagnostic_pending', status: 'active' },
        { $set: { status: 'resolved', resolvedAt: now } }
      );
    }

    await diagnostic.save();
    return res.status(200).json({ success: true, data: diagnostic });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getPendingDiagnostics = async (req, res) => {
  try {
    const pending = await DiagnosticResult.find({
      status: { $in: ['completed', 'ordered'] },
      classification: { $in: ['urgent', 'review_needed'] }
    })
      .populate('patientId', 'name abhaId phone')
      .sort({ classification: -1, orderedAt: -1 });

    return res.status(200).json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDiagnostics,
  createDiagnostic,
  updateDiagnosticStatus,
  getPendingDiagnostics
};
