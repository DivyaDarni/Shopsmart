"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaLeaf } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <FaLeaf className="logo-icon" />
          FreshMart
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>

          <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
            <FaShoppingCart />
            <span className="cart-count">{getCartItemsCount()}</span>
          </Link>

          <div className="nav-dropdown">
            <button className="nav-link dropdown-toggle">
              <FaUser /> {user?.name}
            </button>
            <div className="dropdown-menu">
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                My Orders
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
