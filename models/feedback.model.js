module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        feedback_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        productItemId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
        }
    }, {
        timestamps: true,
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.ProductItem, {
            foreignKey: 'productItemId',
            targetKey: 'product_item_id',
            as: 'productItem'
        });
    };

    return Feedback;
};