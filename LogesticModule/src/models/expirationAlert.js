
const { DataTypes, Model } = require('sequelize');

class ExpirationAlert extends Model {
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
                alert_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'ExpirationAlert',
                tableName: 'expiration_alerts',
                timestamps: false,
            }
        );
    }
}

module.exports = ExpirationAlert;