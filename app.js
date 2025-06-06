const express = require('express');
const app = express();
const routes = require('./routes');
const { sequelize } = require('./models');

require('./services/expiryCheckService'); // Add this line

app.use(express.json());
app.use('/api', routes);

app.listen(3000, async () => {
  try {
    await sequelize.authenticate();
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Server is running on http://localhost:3000');
  } catch (error) {
    console.error('Unable to start server:', error);
  }
});
