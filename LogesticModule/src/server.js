// filepath: d:\project\Logstic\src\server.js

const app = require('./app'); // Import app.js
const sequelize = require('./models');

const PORT = process.env.PORT || 3000;

// Sync database
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});