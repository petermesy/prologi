module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define('Package', {
        package_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        packageName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        holdingCapacity: {
            type: DataTypes.TEXT,
        },
        registrationDate: {
            type: DataTypes.DATE,
        },
    });

    Package.associate = (models) => {
        Package.hasMany(models.ProductItem, {
            foreignKey: 'packageId',
            sourceKey: 'package_id',
            as: 'productItems'
        });
    };

    return Package;
};