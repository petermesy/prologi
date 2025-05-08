const { Sequelize } = require('sequelize');
const config = {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
};

const sequelize = new Sequelize('products', 'logger', '1234', config);

const Category = sequelize.define('Category', {
  category_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
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
    primaryKey: true
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
  }
});

const Package = sequelize.define('Package', {
  package_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
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
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  product_barcode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  registrationDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  location: {
    type: Sequelize.ENUM('store', 'distcenter'),
    allowNull: false
  },
  locationID: {
    type: Sequelize.ENUM('store', 'distcenter'),
    allowNull: false
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
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
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
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});
// Define relationships
Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(ProductItem);
ProductItem.belongsTo(Product);

Package.hasMany(ProductItem);
ProductItem.belongsTo(Package);

ProductItem.hasMany(Feedback);
Feedback.belongsTo(ProductItem);
module.exports = {
  sequelize,
  Category,
  Product,
  Package,
  ProductItem,
  Feedback
};