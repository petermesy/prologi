// const express=require('express')
// const router = express.Router();

// const {createDistributionCtrl,fetchDistributionCtl}=require('../controllers/inventoryCtl')
// const { getInventorySummary } = require('../controllers/inventoryCtl')

// const inventoryRoute=express.Router()

// inventoryRoute.post('/move',createDistributionCtrl)
// inventoryRoute.get('/fetchmove',fetchDistributionCtl)
// router.get('/inventory/summary', getInventorySummary);

// module.exports=inventoryRoute
const express = require('express');
const inventoryRoute = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Add this route:
inventoryRoute.post('/upload/csv', upload.single('file'), uploadController.uploadCSV);
const {
  getAllInventory,
  getInventoryById,
  updateStock,
  getLowStockItems,
  getExpiringItems,
  createDistributionCtrl,
  fetchDistributionCtl,
  getInventorySummary
} = require('../controllers/inventoryCtl');

// Inventory endpoints for frontend
inventoryRoute.get('/inventory', getAllInventory);
inventoryRoute.get('/inventory/:id', getInventoryById);
inventoryRoute.patch('/inventory/:id/stock', updateStock);
inventoryRoute.get('/inventory/low-stock', getLowStockItems);
inventoryRoute.get('/inventory/expiring', getExpiringItems);

// Distribution endpoints
inventoryRoute.post('/move', createDistributionCtrl);
inventoryRoute.get('/fetchmove', fetchDistributionCtl);

// (Optional) Inventory summary endpoint
inventoryRoute.get('/inventory/summary', getInventorySummary);

module.exports = inventoryRoute;