const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define models
const Category = sequelize.define('Category', {
  categoryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'category_id'
  },
  categoryName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  }
});

const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.TEXT,
    primaryKey: true,
    field: 'product_id'
  },
  productName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: DataTypes.TEXT,
  lifeExpectancy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    references: {
      model: 'Categories',
      key: 'category_id'
    },
    field: 'category_id'
  }
});

const Package = sequelize.define('Package', {
  packageId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'package_id'
  },
  packageName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  holdingCapacity: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

const ProductItem = sequelize.define('ProductItem', {
  productItemId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'product_item_id'
  },
  productBarcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'product_barcode'
  },
  productId: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'product_id'
    },
    field: 'product_id'
  },
  productName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  packageId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Packages',
      key: 'package_id'
    },
    field: 'package_id'
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.ENUM('store', 'distcenter'),
    allowNull: false
  },
  locationId: {
    type: DataTypes.ENUM('store', 'distcenter'),
    allowNull: false,
    field: 'location_id'
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('normal', 'attention', 'warning', 'critical', 'expired'),
    defaultValue: 'normal'
  }
});

const Feedback = sequelize.define('Feedback', {
  feedbackId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'feedback_id'
  },
  productItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ProductItems',
      key: 'product_item_id'
    },
    field: 'product_item_id'
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT
  }
}, {
  timestamps: true
});

// Associations
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  sourceKey: 'categoryId',
  as: 'products'
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  targetKey: 'categoryId',
  as: 'category'
});

Product.hasMany(ProductItem, {
  foreignKey: 'productId',
  sourceKey: 'productId',
  as: 'productItems'
});
ProductItem.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'productId',
  as: 'product'
});

Package.hasMany(ProductItem, {
  foreignKey: 'packageId',
  sourceKey: 'packageId',
  as: 'productItems'
});
ProductItem.belongsTo(Package, {
  foreignKey: 'packageId',
  targetKey: 'packageId',
  as: 'package'
});

ProductItem.hasMany(Feedback, {
  foreignKey: 'productItemId',
  sourceKey: 'productItemId',
  as: 'feedbacks'
});
Feedback.belongsTo(ProductItem, {
  foreignKey: 'productItemId',
  targetKey: 'productItemId',
  as: 'productItem'
});

// Hooks
Product.afterUpdate(async (product) => {
  await ProductItem.update(
    { productName: product.productName },
    { where: { productId: product.productId } }
  );
});
Product.afterCreate(async (product) => {
  await ProductItem.update(
    { productName: product.productName },
    { where: { productId: product.productId } }
  );
});

module.exports = {
  sequelize,
  Category,
  Product,
  Package,
  ProductItem,
  Feedback
};
