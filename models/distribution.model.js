module.exports = (sequelize, DataTypes) => {
    const Distribution = sequelize.define('Distribution', {
        product_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Products',
                key: 'product_id'
            }
        },
        distributor_id: {
            type: DataTypes.UUID, // <-- Corrected to UUID
            primaryKey: true,
            references: {
                model: 'DistributionCenters',
                key: 'center_id'
            }
        },
        shipment_location: DataTypes.STRING,
        shipped_at: DataTypes.DATE,
        received_at: DataTypes.DATE,
         quantity: DataTypes.INTEGER 
    }, {
        timestamps: false,
        tableName: 'Distributions'
    });

    Distribution.associate = models => {
        Distribution.belongsTo(models.Product, { foreignKey: 'product_id' });
        Distribution.belongsTo(models.DistributionCenter, { foreignKey: 'distributor_id', targetKey: 'center_id' });
    };

    return Distribution;
};