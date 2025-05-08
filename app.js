const uploadRoutes = require('./routes/upload');
const { sequelize } = require('./models');
const express = require('express');
const app = express();
const routes = require('./routes');

require('./services/expiryCheckService'); // Add this line

app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use(express.json());
app.use('/api', routes);


app.listen(3000, async () => {
  await sequelize.authenticate();
  console.log('Server is running on http://localhost:3000');
});
