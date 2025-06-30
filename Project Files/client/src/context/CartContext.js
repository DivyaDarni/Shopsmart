"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false,
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalAmount: 0,
      }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart()
    }
  }, [isAuthenticated, user])

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const res = await axios.get("/api/cart")
      dispatch({ type: "LOAD_CART", payload: res.data })
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axios.post("/api/cart/add", { productId, quantity })
      dispatch({ type: "LOAD_CART", payload: res.data.cart })
      return { success: true, message: "Item added to cart" }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add item to cart",
      }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await axios.put(`/api/cart/update/${itemId}`, { quantity })
      dispatch({ type: "LOAD_CART", payload: res.data.cart })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update cart",
      }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${itemId}`)
      dispatch({ type: "LOAD_CART", payload: res.data.cart })
      return { success: true, message: "Item removed from cart" }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove item",
      }
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart/clear")
      dispatch({ type: "CLEAR_CART" })
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        loadCart,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
