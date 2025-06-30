"use client"

import { Link, useNavigate } from "react-router-dom"
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import { useCart } from "../context/CartContext"

const Cart = () => {
  const { items, totalAmount, updateCartItem, removeFromCart, loading } = useCart()
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price)
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    const result = await updateCartItem(itemId, newQuantity)
    if (!result.success) {
      toast.error(result.message)
    }
  }

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (loading) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="container">
          <div className="loading">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="empty-cart">
          <div className="container">
            <div className="empty-cart-content">
              <FaShoppingBag className="empty-cart-icon" />
              <h2>Your cart is empty</h2>
              <p>Add some fresh groceries to get started</p>
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Navbar />
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image || "/placeholder.svg?height=100&width=100"} alt={item.product.name} />
                </div>

                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <p className="item-price">
                    {formatPrice(item.product.price)}/{item.product.unit}
                  </p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                    <FaPlus />
                  </button>
                </div>

                <div className="item-total">{formatPrice(item.product.price * item.quantity)}</div>

                <button className="remove-item" onClick={() => handleRemoveItem(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
