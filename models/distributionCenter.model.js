module.exports = (sequelize, DataTypes) => {
    const DistributionCenter = sequelize.define('DistributionCenter', {
        center_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // <-- Add this line
            primaryKey: true,
        },
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        region: DataTypes.STRING,
        level: DataTypes.INTEGER,
    }, {
        timestamps: false,
    });

    DistributionCenter.associate = models => {
        DistributionCenter.hasMany(models.Distribution, {
            foreignKey: 'distributor_id',
            as: 'distributions'
        });
    };

    return DistributionCenter;
};