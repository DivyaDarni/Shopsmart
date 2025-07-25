"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser()
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const loadUser = async () => {
    try {
      const res = await axios.get("/api/auth/me")
      dispatch({ type: "USER_LOADED", payload: res.data })
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password })
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
      return { success: true }
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" })
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password, role = "customer") => {
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      })
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data })
      return { success: true }
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" })
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put("/api/auth/profile", profileData)
      dispatch({ type: "USER_LOADED", payload: res.data.user })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
