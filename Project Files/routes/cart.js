const express = require("express")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate("items.product")

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add item to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    // Check if product exists and has stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    let cart = await Cart.findOne({ user: req.user.userId })

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Insufficient stock" })
      }
      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    await cart.populate("items.product")

    res.json({ message: "Item added to cart", cart })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update cart item quantity
router.put("/update/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    // Check stock
    const product = await Product.findById(cart.items[itemIndex].product)
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    cart.items[itemIndex].quantity = quantity
    await cart.save()
    await cart.populate("items.product")

    res.json({ message: "Cart updated", cart })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Remove item from cart
router.delete("/remove/:itemId", auth, async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
    await cart.save()
    await cart.populate("items.product")

    res.json({ message: "Item removed from cart", cart })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Clear cart
router.delete("/clear", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    res.json({ message: "Cart cleared", cart })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
