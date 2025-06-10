require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Sequelize setup
const db = require('./models');

// Route imports
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store.route');
const restockRoutes = require('./routes/restock.route');
const distributionCenterRoutes = require('./routes/distributionCenter');
const inventoryRoutes = require('./routes/inventoryRoute');
const deliveryRoutes = require('./routes/deliveryTrackRoute');
// const uploadRoutes = require('./routes/upload');
const routes = require('./routes');
const analyticsRoutes = require('./routes/analyticsrouter');

// Init Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Base routes
app.get('/', (req, res) => {
    res.send('Logistics Management API is running...');
});

app.use('/auth', authRoutes);
app.use('/store', storeRoutes);
app.use('/restock', restockRoutes);
app.use('/', routes);
app.use('/distribution-centers', distributionCenterRoutes);
app.use('/api', inventoryRoutes); 
app.use('/track', deliveryRoutes);
app.use('/analytics', analyticsRoutes);
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Sync database and start server
db.sequelize.sync({ alter: true }) // use alter or force as needed
    .then(() => {
        console.log('Database synced.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync DB:', err);
    });
