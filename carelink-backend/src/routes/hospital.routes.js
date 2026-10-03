const express = require('express');
const {
  getHospitals,
  getHospitalById,
  recommendHospitals,
  updateHospitalCapacity
} = require('../controllers/hospital.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getHospitals);
router.get('/recommend', recommendHospitals);
router.get('/:id', getHospitalById);
router.put('/:id/capacity', updateHospitalCapacity);

module.exports = router;
