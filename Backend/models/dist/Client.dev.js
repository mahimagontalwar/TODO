"use strict";

var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
  name: String,
  industry: String
});
module.exports = mongoose.model('Client', ClientSchema);