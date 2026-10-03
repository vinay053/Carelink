const express = require('express');
const {
  getDiagnostics,
  createDiagnostic,
  updateDiagnosticStatus,
  getPendingDiagnostics
} = require('../controllers/diagnostic.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getDiagnostics);
router.post('/', createDiagnostic);
router.get('/pending', getPendingDiagnostics);
router.put('/:id/status', updateDiagnosticStatus);

module.exports = router;
