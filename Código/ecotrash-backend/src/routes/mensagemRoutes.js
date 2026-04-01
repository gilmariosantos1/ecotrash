const express = require('express');
const router = express.Router();
const MensagemController = require('../controllers/MensagemController');

router.post('/', MensagemController.criar);

module.exports = router;
