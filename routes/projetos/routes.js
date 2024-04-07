const express = require('express');
const router = express.Router();
router.use(express.json());

const create  = require('./create');
router.use('/create/',  create);

module.exports = router;