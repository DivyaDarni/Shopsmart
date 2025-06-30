"use client"

import { Link } from "react-router-dom"
import { FaShoppingCart, FaEye } from "react-icons/fa"
import { toast } from "react-toastify"
import { useCart } from "../context/CartContext"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, 1)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price)
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

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || "/placeholder.svg?height=200&width=300"} alt={product.name} />
        <div className="product-overlay">
          <Link to={`/product/${product._id}`} className="overlay-btn">
            <FaEye /> View Details
          </Link>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-price">
          {formatPrice(product.price)}
          <span className="product-unit">/{product.unit}</span>
        </div>

        <div className={`product-availability ${getAvailabilityClass(product.availability)}`}>
          {product.availability}
        </div>

        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.availability === "Out of Stock"}
          >
            <FaShoppingCart /> Add to Cart
          </button>
          <Link to={`/product/${product._id}`} className="buy-now-btn">
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
