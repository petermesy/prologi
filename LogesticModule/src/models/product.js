
const { DataTypes, Model } = require('sequelize');

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                batch_number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                restock_threshold: { // New column for restock threshold
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 10, // Default threshold value
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                manufacture_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                expiration_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'Product',
                tableName: 'products',
                timestamps: false,
            }
        );
    }
}

module.exports = Product;