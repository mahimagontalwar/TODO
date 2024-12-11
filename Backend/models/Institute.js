const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Add geospatial index for location
instituteSchema.index({ location: '2dsphere' });

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;
