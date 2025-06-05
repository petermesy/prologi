
const { DataTypes, Model } = require('sequelize');

class DistributionCenter extends Model {
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
                region: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'DistributionCenter',
                tableName: 'distribution_centers',
                timestamps: false,
            }
        );
    }
}

module.exports = DistributionCenter;