const { Alert, Patient, User } = require('../models');

const getAlerts = async (req, res) => {
  try {
    const { status, type, severity } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['active', 'acknowledged'] };
    }

    if (type) query.type = type;
    if (severity) query.severity = severity;

    // Severity sort ordering: critical -> high -> medium -> low
    const alerts = await Alert.find(query)
      .populate('patientId', 'name abhaId phone address')
      .populate('referralId')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    alerts.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));

    return res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'acknowledged', assignedTo: req.user ? req.user._id : undefined } },
      { new: true }
    );
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    return res.status(200).json({ success: true, message: 'Alert acknowledged.', data: alert });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'resolved', resolvedAt: new Date(), assignedTo: req.user ? req.user._id : undefined } },
      { new: true }
    );
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    return res.status(200).json({ success: true, message: 'Alert resolved.', data: alert });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const sendSmsAlert = async (req, res) => {
  try {
    const { toPhone, message } = req.body;
    const { sendSmsNotification } = require('../services/twilio.service');
    const result = await sendSmsNotification({
      toPhone: toPhone || '9425010001',
      message: message || 'CareLink Alert: A critical healthcare follow-up requires your attention.'
    });

    return res.status(200).json({
      success: true,
      message: `SMS escalation alert processed for ${toPhone}.`,
      deliveryDetails: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  sendSmsAlert
};
