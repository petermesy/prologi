module.exports = (sequelize, DataTypes) => {
    const RestockRequest = sequelize.define('RestockRequest', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        distributionCenterId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantityRequested: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'fulfilled'),
            defaultValue: 'pending',
        },
        requestedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        fulfilledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'restock_requests',
        timestamps: false,
    });

    RestockRequest.associate = models => {
        RestockRequest.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        RestockRequest.belongsTo(models.DistributionCenter, { foreignKey: 'distributionCenterId', as: 'distributionCenter' });
    };

    return RestockRequest;
};
