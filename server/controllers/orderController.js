const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc Create order from cart
// @route POST /api/orders
// @access Private
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    const order = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount,
    });

    await order.save();

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my orders
// @route GET /api/orders/my
// @access Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
