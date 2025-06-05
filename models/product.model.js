module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.TEXT,
            primaryKey: true,
        },
        productName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        LifeExpectancy: {
            type: DataTypes.INTEGER, // in days
        },
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
        });
        Product.hasMany(models.ProductItem, {
            foreignKey: 'productId',
        });
    };

    return Product;
};
