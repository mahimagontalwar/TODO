"use strict";

var mongoose = require('mongoose');

var instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      "enum": ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      // [longitude, latitude]
      required: true
    }
  }
}); // Add geospatial index for location

instituteSchema.index({
  location: '2dsphere'
});
var Institute = mongoose.model('Institute', instituteSchema);
module.exports = Institute;