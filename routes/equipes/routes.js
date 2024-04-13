const express = require('express');
const router = express.Router();
router.use(express.json());

// Cria uma equipe
const create  = require('./create');
router.use('/create/',  create);

// Atualiza uma equipe
const update  = require('./update');
router.use('/update/',  update);

// Deleta uma equipe (apenas muda o status)
const inativar = require('./inativar')
router.use('/inativar/',  inativar);

// Retorna todos os projetos de uma equipe
const getall = require('./getall')
router.use('/getall/',  getall);

module.exports = router;