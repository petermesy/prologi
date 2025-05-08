const { ProductItem, Product, Category, Package, Feedback } = require('../models');
const { Op } = require('sequelize');

// Get product by barcode with all related information
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const productItem = await ProductItem.findOne({
      where: { product_barcode: barcode },
      include: [
        {
          model: Product,
          include: [Category]
        },
        {
          model: Package
        },
        {
          model: Feedback,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!productItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(productItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products that are expired or close to expiry
exports.getExpiryStatus = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    const products = await ProductItem.findAll({
      where: {
        expiryDate: {
          [Op.lte]: thirtyDaysFromNow
        }
      },
      include: [
        {
          model: Product,
          include: [Category]
        },
        {
          model: Package
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    // Categorize products
    const expired = [];
    const nearingExpiry = [];

    products.forEach(product => {
      const expiryDate = new Date(product.expiryDate);
      if (expiryDate <= today) {
        expired.push(product);
      } else {
        nearingExpiry.push(product);
      }
    });

    res.json({
      expired,
      nearingExpiry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add feedback for a product
exports.addFeedback = async (req, res) => {
  try {
    const { barcode } = req.params;
    const { user, feedback, rating } = req.body;

    const productItem = await ProductItem.findOne({
      where: { product_barcode: barcode }
    });

    if (!productItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newFeedback = await Feedback.create({
      user,
      feedback,
      rating,
      ProductItemId: productItem.id
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};