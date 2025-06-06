const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Import controllers
const uploadController = require('../controllers/uploadController');
const productController = require('../controllers/productController');
const expiryController = require('../controllers/expiryController');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with the defined storage
const upload = multer({ storage });

// Upload route for CSV files
router.post('/upload/csv', upload.single('file'), uploadController.uploadCSV);

// Product routes
router.get('/product/:barcode', productController.getProductByBarcode);
router.post('/product/:barcode/feedback', productController.addFeedback);

// Expiry routes
router.get('/expiry/status', expiryController.getExpiryStatus);
router.get('/expiry/by-category', expiryController.getExpiryStatsByCategory);
router.get('/expiry/by-location', expiryController.getExpiryStatsByLocation);

module.exports = router;
