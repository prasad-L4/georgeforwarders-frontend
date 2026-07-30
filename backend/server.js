const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const seedServices = require('./utils/seedServices');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedServices();
    app.listen(process.env.PORT || 3035, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
