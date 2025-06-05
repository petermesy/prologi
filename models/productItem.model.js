module.exports = (sequelize, DataTypes) => {
    const ProductItem = sequelize.define('ProductItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        product_barcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        registrationDate: {
            type: DataTypes.DATE,
        },
        location: {
            type: DataTypes.ENUM('store', 'distcenter'),
        },
        locationID: {
            type: DataTypes.ENUM('store', 'distcenter'),
        },
        expiryDate: {
            type: DataTypes.DATE,
        },
    });

    ProductItem.associate = (models) => {
        ProductItem.belongsTo(models.Product, {
            foreignKey: 'productId',
        });
        ProductItem.belongsTo(models.Package, {
            foreignKey: 'packageId',
        });
        ProductItem.hasMany(models.Feedback, {
            foreignKey: 'productItemId',
        });
    };

    return ProductItem;
};