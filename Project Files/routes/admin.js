const express = require("express")
const Product = require("../models/Product")
const Order = require("../models/Order")
const User = require("../models/User")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Get dashboard stats
router.get("/dashboard", auth, adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments({ role: "customer" })
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const recentOrders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5)

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).limit(5)

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      lowStockProducts,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all products for admin
router.get("/products", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, availability } = req.query
    const query = {}

    if (category && category !== "All") {
      query.category = category
    }

    if (availability && availability !== "All") {
      query.availability = availability
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Product.countDocuments(query)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add new product
router.post("/products", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    })

    await product.save()
    res.status(201).json({ message: "Product added successfully", product })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update product
router.put("/products/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image, stock },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product updated successfully", product })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete product
router.delete("/products/:id", auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all orders for admin
router.get("/orders", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = {}

    if (status && status !== "All") {
      query.orderStatus = status
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update order status
router.put("/orders/:orderId/status", auth, adminAuth, async (req, res) => {
  try {
    const { status, description } = req.body

    const order = await Order.findOne({ orderId: req.params.orderId })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.orderStatus = status
    order.trackingInfo.status = status
    order.trackingInfo.updates.push({
      status,
      description: description || `Order status updated to ${status}`,
    })

    await order.save()

    res.json({ message: "Order status updated successfully", order })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all users
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
