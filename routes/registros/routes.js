const express = require('express');
const router = express.Router();
router.use(express.json());

// inserção dos registros de navegação
const navegacao  = require('./navegacao');
router.use('/navegacao/',  navegacao);

// inserção dos registros de tempo
const tempo  = require('./tempo');
router.use('/tempo/',  tempo);

// inserção dos registros de tempo
const visaogeral  = require('./get-visao-geral');
router.use('/visaogeral/',  visaogeral);

// inserção dos registros de tempo
const infosdominio  = require('./get-info-dominios');
router.use('/infosdominio/',  infosdominio);

module.exports = router;