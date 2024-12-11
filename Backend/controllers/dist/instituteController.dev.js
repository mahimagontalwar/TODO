"use strict";

var Institute = require('../models/Institute'); // Add a new institute


exports.addInstitute = function _callee(req, res) {
  var _req$body, name, location, institute;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, location = _req$body.location;

          if (!(!name || !location || !location.coordinates)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Name and location are required'
          }));

        case 4:
          institute = new Institute({
            name: name,
            location: location
          });
          _context.next = 7;
          return regeneratorRuntime.awrap(institute.save());

        case 7:
          res.status(201).json(institute);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Error adding institute'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Get institutes within a 150km radius


exports.getNearbyInstitutes = function _callee2(req, res) {
  var _req$query, lat, lng, radiusInRadians, institutes;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, lat = _req$query.lat, lng = _req$query.lng;

          if (!(!lat || !lng)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Latitude and Longitude are required'
          }));

        case 4:
          radiusInRadians = 150 / 6378.1; // Earth's radius in km
          // Radius calculation updated to 150 km

          _context2.next = 7;
          return regeneratorRuntime.awrap(Institute.find({
            location: {
              $geoWithin: {
                $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians] // 150km radius

              }
            }
          }));

        case 7:
          institutes = _context2.sent;
          res.status(200).json({
            institutes: institutes
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Error fetching nearby institutes'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};