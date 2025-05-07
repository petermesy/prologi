module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Package', {
      package_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      packageName: DataTypes.STRING,
      holdingCapacity: DataTypes.STRING,
      registrationDate: DataTypes.DATE,
    });
  };
  