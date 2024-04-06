const express = require('express');
const router = express.Router();
router.use(express.json());

const request  = require('./request');
router.use('/request/',  request);

module.exports = router;