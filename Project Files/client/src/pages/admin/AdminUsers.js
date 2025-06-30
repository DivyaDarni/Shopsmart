"use client"

import { useState, useEffect } from "react"
import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users")
      setUsers(res.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="loading">Loading users...</div>
  }

  return (
    <div className="admin-users">
      <div className="container">
        <h1>Manage Users</h1>

        <div className="users-stats">
          <div className="stat-card">
            <FaUser className="stat-icon" />
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Customers</p>
            </div>
          </div>
        </div>

        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <div className="user-details">
                  <div className="detail-item">
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendar />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
                {user.address && (
                  <div className="user-address">
                    <h4>Address:</h4>
                    <p>
                      {user.address.street && `${user.address.street}, `}
                      {user.address.city && `${user.address.city}, `}
                      {user.address.state && `${user.address.state} `}
                      {user.address.pincode}
                    </p>
                    {user.address.phone && <p>Phone: {user.address.phone}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="no-users">
            <h3>No customers found</h3>
            <p>No customers have registered yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
