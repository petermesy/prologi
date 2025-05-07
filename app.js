const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
const { sequelize } = require('./models');

app.use(express.json());
app.use('/api/upload', uploadRoutes);

app.listen(3000, async () => {
  await sequelize.authenticate();
  console.log('Server is running on http://localhost:3000');
});
