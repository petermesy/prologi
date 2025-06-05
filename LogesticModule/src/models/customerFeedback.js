
const { DataTypes, Model } = require('sequelize');

class CustomerFeedback extends Model {
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
                feedback_text: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                customer_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                location: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'CustomerFeedback',
                tableName: 'customer_feedbacks',
                timestamps: false,
            }
        );
    }
}

module.exports = CustomerFeedback;