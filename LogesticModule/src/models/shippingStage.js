
const { DataTypes, Model } = require('sequelize');

class ShippingStage extends Model {
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
                stage_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                stage_status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                start_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                end_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'ShippingStage',
                tableName: 'shipping_stages',
                timestamps: false,
            }
        );
    }
}

module.exports = ShippingStage;