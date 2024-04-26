const express = require('express');
const router = express.Router();
router.use(express.json());

// Cria um projeto
const create  = require('./create');
router.use('/create/',  create);

// Atualiza um projeto
const update  = require('./update');
router.use('/update/',  update);

// Requisita acesso a um projeto
const access = require('./access')
router.use('/access/',  access);

// Deleta um projeto (apenas muda o status do mesmo)
const inativar = require('./inativar')
router.use('/inativar/',  inativar);

// Retorna todos os projetos de uma equipe
const getall = require('./getall')
router.use('/getall/',  getall);

// Retorna todos os projetos de um usuário
const getalluser = require('./getalluser')
router.use('/getalluser/',  getalluser);

module.exports = router;