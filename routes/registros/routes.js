const express = require('express');
const router = express.Router();
router.use(express.json());

// inserção dos registros de navegação
const navegacao  = require('./navegacao');
router.use('/navegacao/',  navegacao);

// inserção dos registros de tempo
const tempo  = require('./tempo');
router.use('/tempo/',  tempo);

// retorna a visão geral do projeto
const visaogeral  = require('./get-visao-geral');
router.use('/visaogeral/',  visaogeral);

// retorna algumas das informações dos domínios
const infosdominio  = require('./get-info-dominios');
router.use('/infosdominio/',  infosdominio);

// retorna algumas das informações dos domínios
const infosdominioext  = require('./get-info-dominios-extensao');
router.use('/infosdominioext/',  infosdominioext);

// retorna as informações de tempo
const tempodominio  = require('./get-tempo-dominios');
router.use('/tempodominio/',  tempodominio);

// retorna as informações de tempo por dia
const tempodia  = require('./get-tempo-dia');
router.use('/tempodia/',  tempodia);

// retorna as informações de pesquisa por dia
const pesquisasdia = require('./get-pesquisas-dia');
router.use('/pesquisasdia/', pesquisasdia);

module.exports = router;