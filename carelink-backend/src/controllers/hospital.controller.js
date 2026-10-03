const { Hospital } = require('../models');
const { rankHospitals } = require('../services/hospital.service');

const getHospitals = async (req, res) => {
  try {
    const { specialty, district, hasCT, hasMRI, type } = req.query;
    const query = {};
    if (district) query.district = district;
    if (type) query.type = type;
    if (specialty) query.specialties = { $regex: specialty, $options: 'i' };
    if (hasCT === 'true') query.hasCT = true;
    if (hasMRI === 'true') query.hasMRI = true;

    const hospitals = await Hospital.find(query).sort({ currentLoad: 1 });
    return res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    return res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const recommendHospitals = async (req, res) => {
  try {
    const { requiredSpecialty, patientLocation, urgency, maxDistance } = req.query;
    const hospitals = await Hospital.find({ isActive: true });

    let parsedLoc = {};
    if (patientLocation) {
      try {
        parsedLoc = JSON.parse(patientLocation);
      } catch (e) {
        parsedLoc = {};
      }
    }

    const recommendations = rankHospitals({
      requiredSpecialty: requiredSpecialty || 'General Medicine',
      patientLocation: parsedLoc,
      urgency: urgency || 'medium',
      maxDistance: Number(maxDistance) || 150,
      hospitals
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateHospitalCapacity = async (req, res) => {
  try {
    const { availableICUBeds, totalICUBeds, currentLoad, estimatedWaitMinutes, specialists, hasCT, hasMRI } = req.body;
    const updates = { lastUpdated: new Date() };

    if (availableICUBeds !== undefined) updates.availableICUBeds = Number(availableICUBeds);
    if (totalICUBeds !== undefined) updates.totalICUBeds = Number(totalICUBeds);
    if (currentLoad !== undefined) updates.currentLoad = Number(currentLoad);
    if (estimatedWaitMinutes !== undefined) updates.estimatedWaitMinutes = Number(estimatedWaitMinutes);
    if (specialists) updates.specialists = specialists;
    if (hasCT !== undefined) updates.hasCT = Boolean(hasCT);
    if (hasMRI !== undefined) updates.hasMRI = Boolean(hasMRI);

    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    return res.status(200).json({ success: true, message: 'Capacity metrics updated.', data: hospital });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHospitals,
  getHospitalById,
  recommendHospitals,
  updateHospitalCapacity
};
