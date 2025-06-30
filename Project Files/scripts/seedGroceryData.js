const mongoose = require("mongoose")
const Product = require("../models/Product")
const User = require("../models/User")
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/grocery-store")
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

const groceryProducts = [
  {
    name: "Fresh Bananas",
    description: "Fresh yellow bananas, perfect for breakfast and snacks",
    price: 60,
    category: "Fruits",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 50,
    unit: "kg",
  },
  {
    name: "Red Apples",
    description: "Crispy and sweet red apples, rich in vitamins",
    price: 150,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 30,
    unit: "kg",
  },
  {
    name: "Fresh Tomatoes",
    description: "Juicy red tomatoes, perfect for cooking and salads",
    price: 40,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1546470427-e5e5d5d5b4b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 25,
    unit: "kg",
  },
  {
    name: "Green Spinach",
    description: "Fresh green spinach leaves, packed with iron and vitamins",
    price: 30,
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 20,
    unit: "kg",
  },
  {
    name: "Whole Milk",
    description: "Fresh whole milk, rich in calcium and protein",
    price: 60,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 40,
    unit: "liters",
  },
  {
    name: "Fresh Eggs",
    description: "Farm fresh eggs, perfect for breakfast and baking",
    price: 120,
    category: "Dairy",
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 100,
    unit: "pieces",
  },
  {
    name: "Chicken Breast",
    description: "Fresh boneless chicken breast, high in protein",
    price: 250,
    category: "Meat",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 15,
    unit: "kg",
  },
  {
    name: "Basmati Rice",
    description: "Premium quality basmati rice, aromatic and fluffy",
    price: 80,
    category: "Grains",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 60,
    unit: "kg",
  },
  {
    name: "Orange Juice",
    description: "Fresh orange juice, 100% natural with no added sugar",
    price: 80,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 35,
    unit: "liters",
  },
  {
    name: "Potato Chips",
    description: "Crispy potato chips, perfect snack for any time",
    price: 40,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 80,
    unit: "packets",
  },
  {
    name: "Green Broccoli",
    description: "Fresh green broccoli, rich in vitamins and minerals",
    price: 90,
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 18,
    unit: "kg",
  },
  {
    name: "Greek Yogurt",
    description: "Creamy Greek yogurt, high in protein and probiotics",
    price: 120,
    category: "Dairy",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 25,
    unit: "packets",
  },
]

const sampleUsers = [
  {
    name: "Demo Customer",
    email: "customer@demo.com",
    password: "password123",
    role: "customer",
  },
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "password123",
    role: "admin",
  },
]

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await Product.deleteMany({})
    await User.deleteMany({})

    // Insert grocery products
    await Product.insertMany(groceryProducts)
    console.log("Grocery products inserted")

    // Insert sample users
    await User.insertMany(sampleUsers)
    console.log("Sample users inserted")

    console.log("Grocery store database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
