const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ================= CREATE ORDER FROM CART =================
exports.createOrder = async (req, res) => {
  try {

    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {

      const product = item.product;

      if (item.quantity > product.countInStock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      // reduce stock
      product.countInStock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Pending",

      // ⭐ order tracking timeline
      statusTimeline: [
        {
          status: "Pending",
          date: new Date()
        }
      ]
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET SINGLE ORDER =================
exports.getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= ADMIN: GET ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= MARK ORDER AS PAID =================
exports.markOrderAsPaid = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "Paid";
    order.paidAt = Date.now();

    await order.save();

    res.json({
      message: "Order marked as paid",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    // ⭐ Add timeline event
    order.statusTimeline.push({
      status,
      date: new Date()
    });

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


// ================= MARK ORDER AS DELIVERED =================
exports.markOrderAsDelivered = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = "Delivered";
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // add timeline
    order.statusTimeline.push({
      status: "Delivered",
      date: new Date()
    });

    await order.save();

    res.json({
      message: "Order marked as delivered",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};