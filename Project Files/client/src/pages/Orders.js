"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaEye, FaTimes } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/my-orders")
      setOrders(res.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Confirmed":
        return "status-confirmed"
      case "Processing":
        return "status-processing"
      case "Shipped":
        return "status-shipped"
      case "Delivered":
        return "status-delivered"
      case "Cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.put(`/api/orders/cancel/${orderId}`)
        toast.success("Order cancelled successfully")
        fetchOrders()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel order")
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="container">
          <div className="empty-orders-content">
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet</p>
            <Link to="/products" className="continue-shopping">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p>Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item._id} className="order-item">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/60x60?text=No+Image"}
                      alt={item.name}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && <p className="more-items">+{order.items.length - 3} more items</p>}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: {formatPrice(order.totalAmount)}</strong>
                </div>
                <div className="order-actions">
                  <Link to={`/order/${order.orderId}`} className="view-order-btn">
                    <FaEye /> View Details
                  </Link>
                  {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
                    <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.orderId)}>
                      <FaTimes /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
