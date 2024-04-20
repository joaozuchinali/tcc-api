const express = require('express');
const router = express.Router();
router.use(express.json());

// inserção dos registros de navegação
const navegacao  = require('./navegacao');
router.use('/navegacao/',  navegacao);

// inserção dos registros de tempo
const tempo  = require('./tempo');
router.use('/tempo/',  tempo);

module.exports = router;