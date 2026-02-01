const Cart = require("../models/Cart");

// @desc Get user cart
// @route GET /api/cart
// @access Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add item to cart
// @route POST /api/cart
// @access Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
        console.log("BODY:", req.body);

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
