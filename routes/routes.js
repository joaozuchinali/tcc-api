const express = require('express');
const router = express.Router();
router.use(express.json());

// Rota de requisição de acesso para o projeto
const access = require('./access/routes');
router.use('/access/', access);

// Rota de criação dos usuários de pesquisa
const usopesquisa = require('./usopesquisa/routes');
router.use('/usopesquisa/', usopesquisa);

// - Rota de criação dos registros de navegação
// - Rota de criação dos registros de tempo
const registros = require('./registros/routes')
router.use('/registros/', registros);

// Rota de criação dos projetos
const projetos = require('./projetos/routes');
router.use('/projetos/', projetos);

module.exports = router;