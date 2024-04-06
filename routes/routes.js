const express = require('express');
const router = express.Router();
router.use(express.json());

// Rota de requisição de acesso para o projeto
const access = require('./access/routes');
router.use('/access/', access);

module.exports = router;