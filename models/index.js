require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const models = {
    Category: require('./category.model')(sequelize, DataTypes),
    Product: require('./product.model')(sequelize, DataTypes),
    Package: require('./package.model')(sequelize, DataTypes),
    ProductItem: require('./productItem.model')(sequelize, DataTypes),
    Feedback: require('./feedback.model')(sequelize, DataTypes),
    User: require('./user.model')(sequelize, DataTypes),
    SentimentAnalysis: require('./sentimentAnalysis.model')(sequelize, DataTypes),
    Distribution: require('./distribution.model')(sequelize, DataTypes),
    DistributionCenter: require('./distributionCenter.model')(sequelize, DataTypes),
    ExpirationAlert: require('./expirationAlert.model')(sequelize, DataTypes),
    InventoryLevel: require('./inventoryLevel.model')(sequelize, DataTypes),
    RestockRequest: require('./restockRequest.model')(sequelize, DataTypes),
};

// Associations
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;