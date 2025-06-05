
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Distribution = require('./distribution');
const DistributionCenter = require('./distributionCenter');
const CustomerFeedback = require('./customerFeedback');
const ExpirationAlert = require('./expirationAlert');
const DefectAlert = require('./defectAlert');
const ShippingStage = require('./shippingStage');
const Location = require('./location');

// Initialize models
User.init(sequelize);
Product.init(sequelize);
Distribution.init(sequelize);
DistributionCenter.init(sequelize);
CustomerFeedback.init(sequelize);
ExpirationAlert.init(sequelize);
DefectAlert.init(sequelize);
ShippingStage.init(sequelize);
Location.init(sequelize);

// Define associations here if needed
// Example: User.hasMany(Product);

module.exports = sequelize;