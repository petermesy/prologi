module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
      category_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      categoryName: DataTypes.STRING,
    });
  };
  