const { Referral, Patient, Hospital, Alert } = require('../models');
const { calculateRiskScore } = require('../services/riskScore.service');
const { getStageSlaHours } = require('../services/careGap.service');

const STAGE_NAMES = [
  'Referral Created',
  'Referral Accepted',
  'Appointment Booked',
  'Patient Arrived at Hospital',
  'Specialist Consulted',
  'Treatment Started',
  'Follow-up Completed',
  'Referral Closed'
];

const getReferrals = async (req, res) => {
  try {
    const { status, urgency, riskLevel, targetSpecialty, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (riskLevel) query.riskLevel = riskLevel;
    if (targetSpecialty) query.targetSpecialty = { $regex: targetSpecialty, $options: 'i' };

    let patientIds;
    if (search) {
      const matchedPatients = await Patient.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { abhaId: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      patientIds = matchedPatients.map(p => p._id);
      query.patientId = { $in: patientIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [referrals, total] = await Promise.all([
      Referral.find(query)
        .populate('patientId', 'name abhaId gender dateOfBirth phone address')
        .populate('referringHospitalId', 'name district type')
        .populate('targetHospitalId', 'name district type')
        .populate('referringDoctorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Referral.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: referrals,
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

const createReferral = async (req, res) => {
  try {
    const {
      patientId,
      targetHospitalId,
      referringHospitalId,
      targetSpecialty,
      urgency = 'medium',
      notes = '',
      distanceKm = 0,
      hasPrivateTransport = false
    } = req.body;

    const referringDoctorId = req.user ? req.user._id : req.body.referringDoctorId;

    const [patient, targetHospital] = await Promise.all([
      Patient.findById(patientId),
      Hospital.findById(targetHospitalId)
    ]);

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    if (!targetHospital) return res.status(404).json({ success: false, message: 'Target hospital not found' });

    // Calculate explainable risk score
    const riskAnalysis = calculateRiskScore(
      { distanceKm, urgency, status: 'created', currentStage: 0, hasPrivateTransport },
      { missedAppointmentsCount: patient.missedAppointmentsCount || 0 },
      { currentLoad: targetHospital.currentLoad || 50 }
    );

    const allowedHours = getStageSlaHours(urgency);
    const expectedDurations = Array.from({ length: 8 }, (_, i) => ({
      stageIndex: i,
      hoursAllowed: allowedHours
    }));

    const stageTimestamps = [{
      stageIndex: 0,
      stageName: STAGE_NAMES[0],
      completedAt: new Date(),
      updatedBy: referringDoctorId,
      notes: notes || 'Referral initiated'
    }];

    const referral = await Referral.create({
      patientId,
      referringDoctorId,
      referringHospitalId: referringHospitalId || patient.hospitalId || targetHospitalId,
      targetHospitalId,
      targetSpecialty,
      urgency,
      status: 'created',
      currentStage: 0,
      stageTimestamps,
      expectedDurations,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskFactors: riskAnalysis.riskFactors,
      recommendedAction: riskAnalysis.recommendedAction,
      notes
    });

    // Auto-create alert if risk score is HIGH
    if (riskAnalysis.riskLevel === 'high') {
      await Alert.create({
        type: 'risk_escalation',
        severity: 'high',
        patientId,
        referralId: referral._id,
        message: `High dropout risk (${riskAnalysis.riskScore}/100) flagged for ${patient.name}. Recommended: ${riskAnalysis.recommendedAction}`,
        status: 'active',
        assignedTo: referringDoctorId
      });
    }

    const populated = await Referral.findById(referral._id)
      .populate('patientId')
      .populate('referringHospitalId targetHospitalId referringDoctorId');

    return res.status(201).json({
      success: true,
      message: 'Referral created and evaluated successfully.',
      data: populated
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('patientId')
      .populate('referringHospitalId')
      .populate('targetHospitalId')
      .populate('referringDoctorId', 'name email role')
      .populate('stageTimestamps.updatedBy', 'name role');

    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });

    const activeAlerts = await Alert.find({ referralId: referral._id, status: 'active' });

    return res.status(200).json({
      success: true,
      data: {
        referral,
        activeAlerts
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const advanceReferralStage = async (req, res) => {
  try {
    const { stageIndex, notes = '' } = req.body;
    const referral = await Referral.findById(req.params.id);

    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });

    const nextStage = stageIndex !== undefined ? Number(stageIndex) : referral.currentStage + 1;
    if (nextStage > 7) {
      return res.status(400).json({ success: false, message: 'Referral is already at final stage.' });
    }

    const stageName = STAGE_NAMES[nextStage] || `Stage ${nextStage}`;
    referral.currentStage = nextStage;

    const statusMap = {
      0: 'created',
      1: 'accepted',
      2: 'appointment_booked',
      3: 'patient_arrived',
      4: 'specialist_consulted',
      5: 'treatment_started',
      6: 'follow_up_done',
      7: 'closed'
    };
    referral.status = statusMap[nextStage] || 'accepted';

    referral.stageTimestamps.push({
      stageIndex: nextStage,
      stageName,
      completedAt: new Date(),
      updatedBy: req.user ? req.user._id : null,
      notes
    });

    await referral.save();

    // AUTO-RESOLVE active referral_gap alerts for this referral!
    const resolvedAlerts = await Alert.updateMany(
      { referralId: referral._id, type: 'referral_gap', status: 'active' },
      { $set: { status: 'resolved', resolvedAt: new Date() } }
    );

    const updated = await Referral.findById(referral._id)
      .populate('patientId')
      .populate('referringHospitalId targetHospitalId referringDoctorId');

    return res.status(200).json({
      success: true,
      message: `Referral advanced to stage ${nextStage} (${stageName}). Associated care gaps resolved.`,
      data: updated,
      resolvedGapsCount: resolvedAlerts.modifiedCount
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAtRiskReferrals = async (req, res) => {
  try {
    const atRisk = await Referral.find({
      status: { $nin: ['closed', 'follow_up_done'] },
      $or: [
        { riskLevel: 'high' },
        { riskScore: { $gte: 60 } }
      ]
    })
      .populate('patientId', 'name abhaId phone address')
      .populate('referringHospitalId targetHospitalId')
      .sort({ riskScore: -1 });

    return res.status(200).json({
      success: true,
      count: atRisk.length,
      data: atRisk
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReferrals,
  createReferral,
  getReferralById,
  advanceReferralStage,
  getAtRiskReferrals
};
