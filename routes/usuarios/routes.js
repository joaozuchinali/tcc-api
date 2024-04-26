const express = require('express');
const router = express.Router();
router.use(express.json());

// Cria um projeto
const create  = require('./create');
router.use('/create/',  create);

// Atualiza um projeto
const update  = require('./update');
router.use('/update/',  update);

// Atualiza um projeto
const updatemail  = require('./updatemail');
router.use('/updatemail/',  updatemail);

// Deleta um projeto (apenas muda o status do mesmo)
const inativar = require('./inativar')
router.use('/inativar/',  inativar);

// Retorna todos os projetos de uma equipe
const get = require('./get')
router.use('/get/',  get);

// Retorna todos os projetos de uma equipe
const getmail = require('./getmail')
router.use('/getmail/',  getmail);

// Retorna todos os projetos de uma equipe
const getequipe = require('./getequipe')
router.use('/getequipe/',  getequipe);

module.exports = router;