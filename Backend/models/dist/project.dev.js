"use strict";

var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  title: String,
  description: String
});
module.exports = mongoose.model('Project', ProjectSchema);