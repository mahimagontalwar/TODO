"use strict";

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var User = require('../models/user'); // Register controller


var register = function register(req, res) {
  var _req$body, username, email, password, user;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          _context.prev = 1;
          user = new User({
            username: username,
            email: email,
            password: password
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(user.save());

        case 5:
          res.status(201).json({
            message: 'User registered successfully'
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(400).json({
            message: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Login controller


var login = function login(req, res) {
  var _req$body2, email, password, user, validPassword, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          validPassword = _context2.sent;

          if (validPassword) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 12:
          // Generate JWT token
          token = jwt.sign({
            _id: user._id
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          res.json({
            token: token,
            id: user._id
          });
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

module.exports = {
  register: register,
  login: login
};