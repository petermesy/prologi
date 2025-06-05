module.exports = (sequelize, DataTypes) => {
    const Distribution = sequelize.define('Distribution', {
        product_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        distributor_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        shipment_location: DataTypes.STRING,
        shipped_at: DataTypes.DATE,
        received_at: DataTypes.DATE,
    }, {
        timestamps: false,
    });

    Distribution.associate = models => {
        Distribution.belongsTo(models.Product, { foreignKey: 'product_id' });
        Distribution.belongsTo(models.DistributionCenter, { foreignKey: 'distributor_id' });
    };

    return Distribution;
};
