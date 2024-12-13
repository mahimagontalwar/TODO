const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  totalAmount: Number,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
