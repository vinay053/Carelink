const express = require('express');
const { chatWithCareBot, getChatHistory } = require('../controllers/carebot.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/chat', chatWithCareBot);
router.get('/history/:sessionId', getChatHistory);

module.exports = router;
