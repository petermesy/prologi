const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restock.controller');

router.post('/requests', restockController.createRequest);
router.get('/requests', restockController.getAllRequests);
router.put('/requests/:id/status', restockController.updateRequestStatus);

module.exports = router;
