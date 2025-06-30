const mongoose = require("mongoose")
const Product = require("../models/Product")
const User = require("../models/User")
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopping-mart")
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

const sampleProducts = [
  {
    name: "iPhone 14 Pro",
    description: "Latest iPhone with advanced camera system and A16 Bionic chip",
    price: 99999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 25,
  },
  {
    name: "Samsung Galaxy S23",
    description: "Flagship Android phone with excellent camera and performance",
    price: 79999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 30,
  },
  {
    name: "MacBook Air M2",
    description: "Lightweight laptop with Apple M2 chip and all-day battery life",
    price: 119999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 15,
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max cushioning",
    price: 8999,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 50,
  },
  {
    name: "Levi's 501 Jeans",
    description: "Classic straight-fit jeans made from premium denim",
    price: 3999,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 40,
  },
  {
    name: "The Alchemist",
    description: "Bestselling novel by Paulo Coelho about following your dreams",
    price: 299,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 100,
  },
  {
    name: "Instant Pot Duo",
    description: "7-in-1 electric pressure cooker for quick and easy meals",
    price: 7999,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 20,
  },
  {
    name: "Maybelline Mascara",
    description: "Volumizing mascara for longer, fuller lashes",
    price: 599,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 75,
  },
  {
    name: "Organic Almonds",
    description: "Premium quality organic almonds, 500g pack",
    price: 899,
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 60,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for comfortable workouts",
    price: 1999,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 35,
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors",
    price: 799,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 80,
  },
  {
    name: "Bluetooth Headphones",
    description: "Wireless headphones with noise cancellation",
    price: 4999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stock: 45,
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

    // Insert sample products
    await Product.insertMany(sampleProducts)
    console.log("Sample products inserted")

    // Insert sample users
    await User.insertMany(sampleUsers)
    console.log("Sample users inserted")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
