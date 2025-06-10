const { Product, Distribution, Feedback, InventoryLevel } = require('../models');

exports.getDashboardMetrics = async (req, res) => {
  try {
    // Total number of products
    const totalProducts = await Product.count();

    // Example: Active shipments (customize as needed)
    const activeShipments = await Distribution.count({ where: { received_at: null } });

    // Example: Average feedback rating (customize as needed)
    let averageRating = null;
    if (Feedback) {
      const feedbacks = await Feedback.findAll();
      if (feedbacks.length > 0) {
        const sum = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
        averageRating = (sum / feedbacks.length).toFixed(2);
      }
    }

    // Example: Low stock items (customize as needed)
    let lowStockCount = null;
    if (InventoryLevel) {
      lowStockCount = await InventoryLevel.count({ where: { quantity: { [require('sequelize').Op.lt]: 10 } } });
    }

    res.json({
      totalProducts,
      activeShipments,
      averageRating,
      lowStockCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};