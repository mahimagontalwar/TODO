const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: String,
  industry: String,
});

module.exports = mongoose.model('Client', ClientSchema);
