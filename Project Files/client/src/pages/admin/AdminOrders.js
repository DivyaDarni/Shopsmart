"use client"

import { useState, useEffect } from "react"
import { FaEdit } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [statusDescription, setStatusDescription] = useState("")

  const orderStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders")
      setOrders(res.data.orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/admin/orders/${selectedOrder.orderId}/status`, {
        status: newStatus,
        description: statusDescription,
      })
      toast.success("Order status updated successfully")
      setShowModal(false)
      setSelectedOrder(null)
      setNewStatus("")
      setStatusDescription("")
      fetchOrders()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status")
    }
  }

  const openStatusModal = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.orderStatus)
    setShowModal(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN")
  }

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <h1>Manage Orders</h1>

        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order.orderId}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name}</strong>
                      <br />
                      <small>{order.user?.email}</small>
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.items.length} items</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={getStatusClass(order.orderStatus)}>{order.orderStatus}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => openStatusModal(order)}>
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Update Order Status - #{selectedOrder.orderId}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <h3>Order Information</h3>
                  <p>
                    <strong>Customer:</strong> {selectedOrder.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user?.email}
                  </p>
                  <p>
                    <strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedOrder.orderStatus}
                  </p>
                </div>

                <div className="order-items">
                  <h3>Order Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleStatusUpdate} className="status-form">
                <div className="form-group">
                  <label>New Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} required>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status Description (Optional)</label>
                  <textarea
                    value={statusDescription}
                    onChange={(e) => setStatusDescription(e.target.value)}
                    placeholder="Add a note about this status update..."
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
