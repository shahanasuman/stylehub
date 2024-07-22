const express = require('express');
const router = express.Router();
const Order = require('../models/ordermodel');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { userId, orderItems, address, totalAmount, status, orderDate } = req.body;
    const newOrder = new Order({
      userId,
      orderItems,
      address,
      totalAmount,
      status,
      orderDate
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/user/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).populate('orderItems.product');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// POST /api/orders/addresses/:userId
router.post('/addresses/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { place, city, pincode, phoneNumber } = req.body;

    // Find user and update previous addresses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new address object
    const newAddress = {
      place,
      city,
      pincode,
      phoneNumber
    };

    // Update user's previousAddresses array
    user.previousAddresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address saved successfully', previousAddresses: user.previousAddresses });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Failed to save address' });
  }
});

// GET /api/orders/addresses/:userId
router.get('/addresses/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ previousAddresses: user.previousAddresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});
// DELETE /api/orders/:orderId
router.delete('/:orderId', protect, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log(`Received request to delete order with ID: ${orderId}`);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log(`Order with ID ${orderId} not found`);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the logged-in user is the owner of the order
    if (order.userId.toString() !== req.user._id.toString()) {
      console.log(`User ${req.user._id} is not authorized to cancel order with ID ${orderId}`);
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    await Order.deleteOne({ _id: orderId });
    console.log(`Order with ID ${orderId} cancelled successfully`);
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

module.exports = router;
