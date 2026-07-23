const express = require('express');
const router = express.Router();
const MunicipioController = require('../controllers/MunicipioController');

router.post('/', MunicipioController.criar);
router.post('/login', MunicipioController.login);
router.put('/senha', MunicipioController.atualizarSenha);
router.post('/recuperar-senha', MunicipioController.recuperarSenha);

module.exports = router;
