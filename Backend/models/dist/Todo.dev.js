"use strict";

var mongoose = require('mongoose'); // Define the schema for the Todo model


var todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    "default": false
  }
}); // Create the model from the schema

var Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;