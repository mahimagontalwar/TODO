"use strict";

var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }] // Refers to Task collection

});
module.exports = mongoose.model('Project', ProjectSchema);