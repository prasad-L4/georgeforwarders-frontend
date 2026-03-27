const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  service: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);