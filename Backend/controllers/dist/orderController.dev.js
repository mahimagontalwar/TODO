"use strict";

var Order = require('../models/Order');

var createOrder = function createOrder(req, res) {
  var _req$body, orderId, project, totalAmount, existingOrder, newOrder, savedOrder;

  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, orderId = _req$body.orderId, project = _req$body.project, totalAmount = _req$body.totalAmount; // Validate request

          if (!(!orderId || !project || !totalAmount)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'All fields are required: orderId,customerName, items, totalAmount'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Order.findOne({
            orderId: orderId
          }));

        case 6:
          existingOrder = _context.sent;

          if (!existingOrder) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "orderId  already exists."
          }));

        case 9:
          // Create a new order
          newOrder = new Order({
            orderId: orderId,
            totalAmount: totalAmount,
            project: project
          }); // Save the order to the database

          _context.next = 12;
          return regeneratorRuntime.awrap(newOrder.save());

        case 12:
          savedOrder = _context.sent;
          res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
          });
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

module.exports = {
  createOrder: createOrder
};