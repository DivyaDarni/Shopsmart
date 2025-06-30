"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { FaFilter, FaTimes } from "react-icons/fa"

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    availability: searchParams.get("availability") || "All",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/products/categories/list")
      setCategories(["All", ...res.data])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.category !== "All") params.append("category", filters.category)
      if (filters.availability !== "All") params.append("availability", filters.availability)
      if (filters.sort) params.append("sort", filters.sort)
      if (filters.search) params.append("search", filters.search)

      const res = await axios.get(`/api/products?${params.toString()}`)
      setProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "All" && v !== "") {
        newSearchParams.set(k, v)
      }
    })
    setSearchParams(newSearchParams)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: "All",
      availability: "All",
      sort: "newest",
      search: "",
    }
    setFilters(clearedFilters)
    setSearchParams({})
  }

  return (
    <div className="products-page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Fresh Groceries</h1>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? "active" : ""}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search groceries..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select value={filters.availability} onChange={(e) => handleFilterChange("availability", e.target.value)}>
                <option value="All">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Limited Stock">Limited Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={filters.sort} onChange={(e) => handleFilterChange("sort", e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="products-content">
            <div className="products-info">
              <p>{products.length} products found</p>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
