import { Link } from "react-router-dom"
import { FaShoppingCart, FaLeaf, FaTruck, FaShieldAlt } from "react-icons/fa"

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <FaLeaf className="logo-icon" />
            <span>FreshMart Grocery</span>
          </div>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fresh Groceries Delivered to Your Door</h1>
            <p>Shop from the comfort of your home and get fresh, quality groceries delivered fast</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Shopping
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Already a Member?
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Fresh Groceries"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Why Choose FreshMart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaLeaf className="feature-icon" />
              <h3>Fresh & Organic</h3>
              <p>Hand-picked fresh produce and organic groceries delivered daily</p>
            </div>
            <div className="feature-card">
              <FaTruck className="feature-icon" />
              <h3>Fast Delivery</h3>
              <p>Same-day delivery available. Get your groceries when you need them</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Quality Guaranteed</h3>
              <p>100% satisfaction guarantee on all products. Fresh or your money back</p>
            </div>
            <div className="feature-card">
              <FaShoppingCart className="feature-icon" />
              <h3>Easy Shopping</h3>
              <p>Simple, intuitive shopping experience with secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-preview">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Fruits"
              />
              <h3>Fresh Fruits</h3>
            </div>
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Vegetables"
              />
              <h3>Vegetables</h3>
            </div>
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Dairy"
              />
              <h3>Dairy Products</h3>
            </div>
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Meat"
              />
              <h3>Fresh Meat</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers who trust FreshMart for their grocery needs</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <FaLeaf className="logo-icon" />
              <span>FreshMart Grocery</span>
            </div>
            <p>&copy; 2024 FreshMart Grocery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
