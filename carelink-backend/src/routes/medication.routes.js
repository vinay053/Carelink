const express = require('express');
const {
  getMedicationsByPatient,
  reconcileMedications,
  addPrescription,
  resolveConflict
} = require('../controllers/medication.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/:patientId', getMedicationsByPatient);
router.post('/reconcile', reconcileMedications);
router.post('/add-prescription', addPrescription);
router.put('/conflicts/:conflictId/resolve', resolveConflict);

module.exports = router;
