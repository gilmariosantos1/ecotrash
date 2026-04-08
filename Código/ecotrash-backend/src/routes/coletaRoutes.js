const express = require('express');
const router = express.Router();
const ColetaController = require('../controllers/ColetaController');

router.post('/', ColetaController.criar);
router.get('/cidadao/:cpf', ColetaController.buscarPorCpf);
router.get('/municipio/:estado/:cidade', ColetaController.buscarPorMunicipio);
router.get('/:id', ColetaController.buscarPorId);
router.put('/:id', ColetaController.atualizar);

module.exports = router;
