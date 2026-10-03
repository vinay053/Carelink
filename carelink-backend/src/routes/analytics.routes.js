const express = require('express');
const {
  getOverview,
  getStageBreakdown,
  getRiskDistribution,
  getCompletionTrend,
  getHospitalPerformance
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/stage-breakdown', getStageBreakdown);
router.get('/risk-distribution', getRiskDistribution);
router.get('/completion-trend', getCompletionTrend);
router.get('/hospital-performance', getHospitalPerformance);

module.exports = router;
