"use strict";

var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  orderId: String,
  totalAmount: Number
});
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;