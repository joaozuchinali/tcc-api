const express = require('express');
const router = express.Router();
router.use(express.json());

// Cria um registro
const create  = require('./create');
router.use('/create/',  create);

// Atualzia um registro
const update  = require('./update');
router.use('/update/',  update);

// Deleta um registro
const deleteR  = require('./delete');
router.use('/delete/',  deleteR);

module.exports = router;