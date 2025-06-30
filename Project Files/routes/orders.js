const express = require("express")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const auth = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/create", auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        })
      }
    }

    // Create order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }))

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      trackingInfo: {
        status: "Order Placed",
        updates: [
          {
            status: "Order Placed",
            description: "Your order has been placed successfully",
          },
        ],
      },
    })

    await order.save()

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
    }

    // Clear cart
    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order.orderId,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate("items.product").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single order
router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user.userId,
    }).populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Cancel order
router.put("/cancel/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user.userId,
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.orderStatus !== "Pending" && order.orderStatus !== "Confirmed") {
      return res.status(400).json({ message: "Order cannot be cancelled" })
    }

    order.orderStatus = "Cancelled"
    order.trackingInfo.status = "Cancelled"
    order.trackingInfo.updates.push({
      status: "Cancelled",
      description: "Order cancelled by customer",
    })

    await order.save()

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    }

    res.json({ message: "Order cancelled successfully", order })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
