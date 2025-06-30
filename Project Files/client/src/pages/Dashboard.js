"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { FaShoppingCart, FaLeaf, FaTruck, FaShieldAlt } from "react-icons/fa"

const Dashboard = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get("/api/products?limit=8")
      setFeaturedProducts(res.data.slice(0, 8))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <FaLeaf />,
      title: "Fresh & Organic",
      description: "Hand-picked fresh produce delivered daily",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      description: "Same-day delivery available in your area",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all products",
    },
    {
      icon: <FaShoppingCart />,
      title: "Easy Shopping",
      description: "Simple and secure shopping experience",
    },
  ]

  return (
    <div className="dashboard">
      <Navbar />

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fresh Groceries at Your Fingertips</h1>
            <p>Shop from our wide selection of fresh, quality groceries</p>
            <Link to="/products" className="btn btn-primary btn-large">
              Start Shopping
            </Link>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Fresh Groceries"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Shop With Us?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All Products
            </Link>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=Fruits" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Fruits"
              />
              <h3>Fresh Fruits</h3>
            </Link>
            <Link to="/products?category=Vegetables" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Vegetables"
              />
              <h3>Vegetables</h3>
            </Link>
            <Link to="/products?category=Dairy" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Dairy"
              />
              <h3>Dairy Products</h3>
            </Link>
            <Link to="/products?category=Meat" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Meat"
              />
              <h3>Fresh Meat</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
