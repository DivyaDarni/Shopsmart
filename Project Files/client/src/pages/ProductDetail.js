"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa"
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`)
      setProduct(res.data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Product not found")
      navigate("/products")
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    const result = await addToCart(product._id, quantity)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase")
      navigate("/login")
      return
    }

    const result = await addToCart(product._id, quantity)
    if (result.success) {
      navigate("/checkout")
    } else {
      toast.error(result.message)
    }
  }

  const getAvailabilityClass = (availability) => {
    switch (availability) {
      case "In Stock":
        return "in-stock"
      case "Limited Stock":
        return "limited-stock"
      case "Out of Stock":
        return "out-of-stock"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading product...</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="product-detail-layout">
          <div className="product-image-section">
            <img src={product.image || "https://via.placeholder.com/500x400?text=No+Image"} alt={product.name} />
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>

            <div className="product-price">{formatPrice(product.price)}</div>

            <div className={`product-availability ${getAvailabilityClass(product.availability)}`}>
              {product.availability} ({product.stock} items left)
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.availability !== "Out of Stock" && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                      <FaMinus />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button className="buy-now-btn" onClick={handleBuyNow}>
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
