const express = require('express');
const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  sendSmsAlert
} = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.put('/:id/acknowledge', acknowledgeAlert);
router.put('/:id/resolve', resolveAlert);
router.post('/send-sms', sendSmsAlert);

module.exports = router;
