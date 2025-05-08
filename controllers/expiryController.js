const { ProductItem, Product, Category, Package } = require('../models');
const { Op } = require('sequelize');

// Get expiry status
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
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category'
            }
          ]
        },
        {
          model: Package,
          as: 'package'
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    const expired = [];
    const critical = [];
    const warning = [];
    const attention = [];

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
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category'
            }
          ]
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    const categoryStats = {};

    products.forEach(product => {
      const categoryName = product.product?.category?.categoryName || 'Unknown';
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
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category'
            }
          ]
        }
      ],
      order: [['expiryDate', 'ASC']]
    });

    const locationStats = {};

    products.forEach(product => {
      const location = product.location || 'Unknown';
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
