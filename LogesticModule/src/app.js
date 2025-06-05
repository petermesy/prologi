const express = require('express');
const inventoryRoutes = require('./routes/inventoryRoute');
const deliveryRoutes = require('./routes/deliveryTrackRoute');
const app = express();

app.use(express.json());
app.use('/inventory', inventoryRoutes); 
app.use('/track', deliveryRoutes);

// module.exports = app;
module.exports = app;