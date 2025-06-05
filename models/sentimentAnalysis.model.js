module.exports = (sequelize, DataTypes) => {
    const SentimentAnalysis = sequelize.define('SentimentAnalysis', {
        analysis_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        feedback_id: {
            type: DataTypes.UUID, // <-- Changed from INTEGER to UUID
            allowNull: false,
        },
        product_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sentiment: {
            type: DataTypes.ENUM('positive', 'neutral', 'negative'),
        },
        comment: {
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'sentiment_analysis',
        timestamps: false,
    });

    SentimentAnalysis.associate = (models) => {
        SentimentAnalysis.belongsTo(models.Feedback, { foreignKey: 'feedback_id' });
        SentimentAnalysis.belongsTo(models.Product, { foreignKey: 'product_id' });
    };

    return SentimentAnalysis;
};