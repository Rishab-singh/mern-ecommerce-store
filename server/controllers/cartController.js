const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const qty = Number(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USER CART =================
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price image countInStock");

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    let totalAmount = 0;

    const updatedItems = cart.items.map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        product: item.product,
        quantity: item.quantity,
        itemTotal,
      };
    });

    res.json({
      items: updatedItems,
      totalAmount,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE QUANTITY =================
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    const product = await Product.findById(productId);

    if (quantity > product.countInStock) {
      return res
        .status(400)
        .json({ message: "Not enough stock available" });
    }

    item.quantity = quantity;

    await cart.save();
    res.json({ message: "Cart updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REMOVE ITEM =================
exports.removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId; // ✅ FIXED

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed from cart" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};