module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Product', {
      productId: { type: DataTypes.STRING, primaryKey: true },
      productName: DataTypes.STRING,
      description: DataTypes.TEXT,
      LifeExpectancy: DataTypes.INTEGER,
    });
  };
  