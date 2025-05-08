const { ProductItem, Product, Category, Package } = require('../models');
const { Op } = require('sequelize');

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

    // Categorize products by expiry status
    const expired = [];
    const critical = []; // 0-7 days
    const warning = []; // 8-14 days
    const attention = []; // 15-30 days

    products.forEach(product => {
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 0) {
        expired.push({ ...product.toJSON(), daysUntilExpiry });
      } else if (daysUntilExpiry <= 7) {
        critical.push({ ...product.toJSON(), daysUntilExpiry });
      } else if (daysUntilExpiry <= 14) {
        warning.push({ ...product.toJSON(), daysUntilExpiry });
      } else {
        attention.push({ ...product.toJSON(), daysUntilExpiry });
      }
    });

    res.json({
      summary: {
        total: products.length,
        expired: expired.length,
        critical: critical.length,
        warning: warning.length,
        attention: attention.length
      },
      details: {
        expired,
        critical,
        warning,
        attention
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expiry statistics by category
exports.getExpiryStatsByCategory = async (req, res) => {
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
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    // Group by category
    const categoryStats = {};

    products.forEach(product => {
      const categoryName = product.Product.Category.categoryName;
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          expired: 0,
          critical: 0,
          warning: 0,
          attention: 0,
          total: 0
        };
      }

      categoryStats[categoryName].total++;

      if (daysUntilExpiry <= 0) {
        categoryStats[categoryName].expired++;
      } else if (daysUntilExpiry <= 7) {
        categoryStats[categoryName].critical++;
      } else if (daysUntilExpiry <= 14) {
        categoryStats[categoryName].warning++;
      } else {
        categoryStats[categoryName].attention++;
      }
    });

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expiry statistics by location
exports.getExpiryStatsByLocation = async (req, res) => {
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
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    // Group by location
    const locationStats = {};

    products.forEach(product => {
      const location = product.location;
      const expiryDate = new Date(product.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (!locationStats[location]) {
        locationStats[location] = {
          expired: 0,
          critical: 0,
          warning: 0,
          attention: 0,
          total: 0
        };
      }

      locationStats[location].total++;

      if (daysUntilExpiry <= 0) {
        locationStats[location].expired++;
      } else if (daysUntilExpiry <= 7) {
        locationStats[location].critical++;
      } else if (daysUntilExpiry <= 14) {
        locationStats[location].warning++;
      } else {
        locationStats[location].attention++;
      }
    });

    res.json(locationStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};