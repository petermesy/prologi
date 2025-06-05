module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        categoryName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId', // Make sure Product model uses categoryId as FK
            sourceKey: 'category_id',
            as: 'products'
        });
    };

    return Category;
};