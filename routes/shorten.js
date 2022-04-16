const express = require('express');
const router = express.Router();
const URL = require('../models/url');

router.post('/', (req, res) => {
  res.status(201).json(req.body);
});

module.exports = router;