module.exports = (sequelize, DataTypes) => {
    const InventoryLevel = sequelize.define('InventoryLevel', {
        inventory_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location_id: {
            type: DataTypes.UUID, // <-- Fix: use UUID to match DistributionCenter.center_id
            allowNull: false,
            references: {
                model: 'DistributionCenters',
                key: 'center_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        last_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'inventory_levels',
        timestamps: false,
    });

    InventoryLevel.associate = models => {
        InventoryLevel.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
        InventoryLevel.belongsTo(models.DistributionCenter, {
            foreignKey: 'location_id',
            targetKey: 'center_id',
            as: 'location',
        });
    };

    return InventoryLevel;
};