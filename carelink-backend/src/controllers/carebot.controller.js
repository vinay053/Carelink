const { ChatMessage, Patient, Referral, DiagnosticResult, Medication } = require('../models');
const { streamCareBotResponse } = require('../services/gemini.service');

const chatWithCareBot = async (req, res) => {
  try {
    const { message, patientId, sessionId = `session_${Date.now()}` } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // Save user message to history
    await ChatMessage.create({
      sessionId,
      userId,
      role: 'user',
      content: message,
      relatedPatientId: patientId || null
    });

    // Gather patient context if patientId is provided
    let patientContext = null;
    if (patientId) {
      const [patient, referrals, diagnostics, medications] = await Promise.all([
        Patient.findById(patientId),
        Referral.find({ patientId }).sort({ createdAt: -1 }).limit(3),
        DiagnosticResult.find({ patientId }).sort({ orderedAt: -1 }).limit(3),
        Medication.findOne({ patientId })
      ]);

      if (patient) {
        patientContext = {
          name: patient.name,
          abhaId: patient.abhaId,
          age: patient.dateOfBirth ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 3600 * 1000)) : 'N/A',
          gender: patient.gender,
          district: patient.address?.district,
          activeReferralsCount: referrals.length,
          currentStageName: referrals[0]?.status,
          riskScore: referrals[0]?.riskScore,
          riskLevel: referrals[0]?.riskLevel,
          recentDiagnostics: diagnostics.map(d => `${d.testName} (${d.status}, ${d.classification})`),
          activeMedications: (patient.currentMedications || []).map(m => m.drugName)
        };
      }
    }

    // Retrieve previous messages in this session
    const pastMessages = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 }).limit(10);
    const messages = pastMessages.map(m => ({ role: m.role, content: m.content }));

    // Stream the response directly to client via SSE
    await streamCareBotResponse({
      messages,
      patientContext,
      res
    });
  } catch (error) {
    console.error('CareBot error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 });
    return res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  chatWithCareBot,
  getChatHistory
};
