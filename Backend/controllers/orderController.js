const Order = require('../models/Order');
const createOrder = async (req, res) => {
    try {
      const { orderId, project,totalAmount } = req.body;
  
      // Validate request
      if (!orderId  || !project || !totalAmount) {
        return res.status(400).json({ error: 'All fields are required: orderId,customerName, items, totalAmount' });
      }
      const existingOrder= await Order.findOne({ orderId: orderId });
      if (existingOrder) {
          return res.status(400).json({ message: "orderId  already exists." });
        }
      // Create a new order
      const newOrder = new Order({
        orderId,
        totalAmount,
        project
      });
  
      // Save the order to the database
      const savedOrder = await newOrder.save();
  
      res.status(201).json({
        message: 'Order created successfully',
        order: savedOrder,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { createOrder };
