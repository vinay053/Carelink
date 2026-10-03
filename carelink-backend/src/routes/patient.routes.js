const express = require('express');
const { getPatients, createPatient, getPatientById, updatePatient, getPatientTimeline } = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // protect all patient routes

router.get('/', getPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.get('/:id/timeline', getPatientTimeline);

module.exports = router;
