const express = require("express")
const Product = require("../models/Product")

const router = express.Router()

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, availability, sort } = req.query
    const query = {}

    // Filter by category
    if (category && category !== "All") {
      query.category = category
    }

    // Filter by availability
    if (availability && availability !== "All") {
      query.availability = availability
    }

    // Search functionality
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    let sortOption = {}
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 }
        break
      case "price-high":
        sortOption = { price: -1 }
        break
      case "name":
        sortOption = { name: 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const products = await Product.find(query).sort(sortOption)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
