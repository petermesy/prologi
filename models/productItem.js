module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProductItem', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      product_barcode: DataTypes.STRING,
      registrationDate: DataTypes.DATE,
      location: DataTypes.STRING,
      locationID: DataTypes.STRING,
      expiryDate: DataTypes.DATE,
    });
  };
  