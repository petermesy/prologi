const express = require('express');
const router = express.Router();
const controller = require('../controllers/distributionCenter.controller');

// List all distribution centers
router.get('/', controller.list);

// Create a new distribution center
router.post('/', controller.create);

module.exports = router;