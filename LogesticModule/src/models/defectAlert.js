
const { DataTypes, Model } = require('sequelize');

class DefectAlert extends Model {
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
                defect_description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                defect_report_date: {
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
                modelName: 'DefectAlert',
                tableName: 'defect_alerts',
                timestamps: false,
            }
        );
    }
}

module.exports = DefectAlert;