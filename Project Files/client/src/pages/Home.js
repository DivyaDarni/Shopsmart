"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import { FaShoppingBag, FaTruck, FaHeadset, FaShieldAlt } from "react-icons/fa"

const Home = () => {
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
      icon: <FaShoppingBag />,
      title: "Wide Selection",
      description: "Thousands of products across multiple categories",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Shopping",
      description: "Safe and secure payment processing",
    },
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopMart</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Shopping"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose ShopMart?</h2>
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
            <Link to="/products?category=Electronics" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Electronics"
              />
              <h3>Electronics</h3>
            </Link>
            <Link to="/products?category=Clothing" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Clothing"
              />
              <h3>Clothing</h3>
            </Link>
            <Link to="/products?category=Home & Garden" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Home & Garden"
              />
              <h3>Home & Garden</h3>
            </Link>
            <Link to="/products?category=Books" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Books"
              />
              <h3>Books</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
