"use strict";

var model = require('../models/task');

var importT = function importT(req, res) {
  return regeneratorRuntime.async(function importT$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            res.send({
              status: 200,
              success: true,
              msg: 'csv imported'
            });
          } catch (error) {
            res.send({
              status: 400,
              success: false,
              msg: error.message
            });
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  importT: importT
};