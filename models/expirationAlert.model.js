module.exports = (sequelize, DataTypes) => {
    const ExpirationAlert = sequelize.define('ExpirationAlert', {
        alert_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        product_id: DataTypes.STRING,
        alert_date: DataTypes.DATE,
        status: DataTypes.STRING,
    }, {
        timestamps: false,
    });

    ExpirationAlert.associate = models => {
        ExpirationAlert.belongsTo(models.Product, { foreignKey: 'product_id' });
    };

    return ExpirationAlert;
};
