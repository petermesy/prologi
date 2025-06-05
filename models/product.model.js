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
// Add after the associate function in product.model.js
Product.afterUpdate(async (product) => {
    await sequelize.models.ProductItem.update(
        { productName: product.productName },
        { where: { productId: product.product_id } }
    );
});
Product.afterCreate(async (product) => {
    await sequelize.models.ProductItem.update(
        { productName: product.productName },
        { where: { productId: product.product_id } }
    );
});
    return Product;
};
