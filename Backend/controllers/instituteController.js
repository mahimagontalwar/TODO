const Institute = require('../models/Institute');

// Add a new institute
exports.addInstitute = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location || !location.coordinates) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const institute = new Institute({
      name,
      location,
    });

    await institute.save();
    res.status(201).json(institute);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding institute' });
  }
};

// Get institutes within a 150km radius
exports.getNearbyInstitutes = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
    const radiusInRadians = 150 / 6378.1; // Earth's radius in km
    // Radius calculation updated to 150 km
    const institutes = await Institute.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians], // 150km radius
        },
      },
    });

    res.status(200).json({ institutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching nearby institutes' });
  }
};
