
const { DataTypes, Model } = require('sequelize');

class Location extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                location_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                region: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'Location',
                tableName: 'locations',
                timestamps: false,
            }
        );
    }
}

module.exports = Location;