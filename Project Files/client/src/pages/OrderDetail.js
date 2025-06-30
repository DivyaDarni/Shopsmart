"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaTimes } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${orderId}`)
      setOrder(res.data)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Order not found")
      navigate("/orders")
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
      hour: "2-digit",
      minute: "2-digit",
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

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.put(`/api/orders/cancel/${orderId}`)
        toast.success("Order cancelled successfully")
        fetchOrder()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel order")
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading order details...</div>
  }

  if (!order) {
    return <div className="error">Order not found</div>
  }

  return (
    <div className="order-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/orders")}>
          <FaArrowLeft /> Back to Orders
        </button>

        <div className="order-detail-header">
          <div className="order-info">
            <h1>Order #{order.orderId}</h1>
            <p>Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="order-status">
            <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
          </div>
        </div>

        <div className="order-detail-layout">
          <div className="order-main">
            {/* Order Items */}
            <div className="order-section">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {order.items.map((item) => (
                  <div key={item._id} className="order-item-detail">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/80x80?text=No+Image"}
                      alt={item.name}
                    />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {formatPrice(item.price)}</p>
                    </div>
                    <div className="item-total">
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="order-section">
              <h3>Shipping Address</h3>
              <div className="address-card">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.pincode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="order-section">
              <h3>Order Tracking</h3>
              <div className="tracking-timeline">
                {order.trackingInfo.updates.map((update, index) => (
                  <div key={index} className="tracking-item">
                    <div className="tracking-dot"></div>
                    <div className="tracking-content">
                      <h4>{update.status}</h4>
                      <p>{update.description}</p>
                      <span className="tracking-time">{formatDate(update.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-sidebar">
            {/* Order Summary */}
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="payment-info">
                <h4>Payment Method</h4>
                <p>{order.paymentMethod}</p>
              </div>

              {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
                <button className="cancel-order-btn" onClick={handleCancelOrder}>
                  <FaTimes /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
