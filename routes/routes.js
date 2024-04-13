const express = require('express');
const router = express.Router();
router.use(express.json());

// Rota de manutenção dos usuarios
const usuarios = require('./usuarios/routes');
router.use('/usuarios/', usuarios);

// Rota de manutenção das equipes
const equipes = require('./equipes/routes');
router.use('/equipes/', equipes);

// Rota de manutenção dos registros de equipeuso
const equipeuso = require('./equipeuso/routes');
router.use('/equipeuso/', equipeuso);

// Rota de manutenção dos projetos
const projetos = require('./projetos/routes');
router.use('/projetos/', projetos);

// Rota de manutenção dos usuários pesquisados
const usopesquisa = require('./usopesquisa/routes');
router.use('/usopesquisa/', usopesquisa);

// Rota de manutenção dos registros coletados na extensão
const navegacao = require('./navegacao/routes')
router.use('/navegacao/', navegacao);

module.exports = router;