
const { DataTypes, Model } = require('sequelize');

class Distribution extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                product_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
              
                distribution_center_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                shipment_location: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                shipment_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'Distribution',
                tableName: 'distributions',
                timestamps: false,
            }
        );
    }
}

module.exports = Distribution;