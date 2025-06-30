"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUsers, FaShoppingBag, FaBoxOpen, FaRupeeSign, FaEye } from "react-icons/fa"
import axios from "axios"

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    },
    recentOrders: [],
    lowStockProducts: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard")
      setDashboardData(res.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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
    return new Date(date).toLocaleDateString("en-IN")
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBoxOpen />
            </div>
            <div className="stat-info">
              <h3>{dashboardData.stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaShoppingBag />
            </div>
            <div className="stat-info">
              <h3>{dashboardData.stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{dashboardData.stats.totalUsers}</h3>
              <p>Total Customers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaRupeeSign />
            </div>
            <div className="stat-info">
              <h3>{formatPrice(dashboardData.stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all-link">
                View All
              </Link>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order.orderId}</td>
                      <td>{order.user?.name}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{formatPrice(order.totalAmount)}</td>
                      <td>
                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/orders`} className="action-btn">
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Low Stock Alert</h2>
              <Link to="/admin/products" className="view-all-link">
                Manage Products
              </Link>
            </div>
            <div className="low-stock-list">
              {dashboardData.lowStockProducts.map((product) => (
                <div key={product._id} className="low-stock-item">
                  <img src={product.image || "https://via.placeholder.com/60x60?text=No+Image"} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>Stock: {product.stock} units</p>
                  </div>
                  <span className="stock-warning">Low Stock</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-card">
              <FaBoxOpen />
              <span>Manage Products</span>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FaShoppingBag />
              <span>View Orders</span>
            </Link>
            <Link to="/admin/users" className="action-card">
              <FaUsers />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
