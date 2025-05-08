const { Sequelize } = require('sequelize');
const config = {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
};

const sequelize = new Sequelize('products', 'logger', '1234', config);

const Category = sequelize.define('Category', {
  categoryId: {  // Changed from category_id to categoryId for consistency
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    field: 'category_id'  // This maintains the database column name
  },
  categoryName: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  }
});

const Product = sequelize.define('Product', {
  productId: {
    type: Sequelize.TEXT,
    primaryKey: true,
    field: 'product_id'
  },
  productName: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  lifeExpectancy: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  categoryId: {  // Added explicit foreign key
    type: Sequelize.UUID,
    references: {
      model: 'Categories',
      key: 'category_id'
    },
    field: 'category_id'
  }
});

const Package = sequelize.define('Package', {
  packageId: {  // Changed from package_id to packageId
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    field: 'package_id'
  },
  packageName: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  holdingCapacity: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  registrationDate: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

const ProductItem = sequelize.define('ProductItem', {
  productItemId: {  // Changed from id to productItemId
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    field: 'product_item_id'
  },
  productBarcode: {  // Changed from product_barcode to productBarcode
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    field: 'product_barcode'
  },
  productId: {  // Added explicit foreign key
    type: Sequelize.TEXT,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'product_id'
    },
    field: 'product_id'
  },
  productName: {  // Added productName column
    type: Sequelize.TEXT,
    allowNull: false
  },
  packageId: {  // Added explicit foreign key
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Packages',
      key: 'package_id'
    },
    field: 'package_id'
  },
  registrationDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  location: {
    type: Sequelize.ENUM('store', 'distcenter'),
    allowNull: false
  },
  locationId: {
    type: Sequelize.ENUM('store', 'distcenter'),
    allowNull: false,
    field: 'location_id'
  },
  expiryDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('normal', 'attention', 'warning', 'critical', 'expired'),
    defaultValue: 'normal'
  }
});

const Feedback = sequelize.define('Feedback', {
  feedbackId: {  // Changed from id to feedbackId
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    field: 'feedback_id'
  },
  productItemId: {  // Added explicit foreign key
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'ProductItems',
      key: 'product_item_id'
    },
    field: 'product_item_id'
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  feedback: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  rating: {
    type: Sequelize.FLOAT
  }
}, {
  timestamps: true
});

// Define relationships with proper foreign keys
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

// Hooks to sync productName
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