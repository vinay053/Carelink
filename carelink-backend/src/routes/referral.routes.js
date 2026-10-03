const express = require('express');
const {
  getReferrals,
  createReferral,
  getReferralById,
  advanceReferralStage,
  getAtRiskReferrals
} = require('../controllers/referral.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getReferrals);
router.post('/', createReferral);
router.get('/at-risk', getAtRiskReferrals);
router.get('/:id', getReferralById);
router.put('/:id/stage', advanceReferralStage);

module.exports = router;
