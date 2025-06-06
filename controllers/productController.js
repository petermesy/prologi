const { ProductItem, Product, Category, Package, Feedback } = require('../models');

exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const productItem = await ProductItem.findOne({
      where: { product_barcode: barcode },
      include: [
        {
          model: Product,
          as: 'product',
          include: [{
            model: Category,
            as: 'category'
          }]
        },
        {
          model: Package,
          as: 'package'
        },
        {
          model: Feedback,
          as: 'feedbacks'
        }
      ]
    });

    if (!productItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(productItem);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
};

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
      productItemId: productItem.product_item_id,
      user,
      feedback,
      rating
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: error.message });
  }
};