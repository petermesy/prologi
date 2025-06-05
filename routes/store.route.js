const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

// store
router.get('/inventory/:location_id', storeController.getInventoryByLocation);
router.post('/inventory', storeController.upsertInventory);
router.put('/inventory/:product_id/:location_id', storeController.adjustInventory);
router.delete('/inventory/:product_id/:location_id', storeController.deleteInventory);

module.exports = router;
