module.exports = (sequelize, DataTypes) => {
    const ProductItem = sequelize.define('ProductItem', {
        product_item_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        product_barcode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        productId: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        productName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        packageId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        registrationDate: {
            type: DataTypes.DATE,
        },
        location: {
            type: DataTypes.ENUM('store', 'distcenter'),
        },
        locationId: {
            type: DataTypes.ENUM('store', 'distcenter'),
        },
        expiryDate: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM('normal', 'attention', 'warning', 'critical', 'expired'),
            defaultValue: 'normal'
        }
    });

    ProductItem.associate = (models) => {
        ProductItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            targetKey: 'product_id',
            as: 'product'
        });
        ProductItem.belongsTo(models.Package, {
            foreignKey: 'packageId',
            targetKey: 'package_id',
            as: 'package'
        });
        ProductItem.hasMany(models.Feedback, {
            foreignKey: 'productItemId',
            sourceKey: 'product_item_id',
            as: 'feedbacks'
        });
    };

    return ProductItem;
};