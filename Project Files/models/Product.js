const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Beverages", "Snacks", "Others"],
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "grams", "liters", "pieces", "packets"],
      default: "kg",
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited Stock"],
      default: function () {
        if (this.stock === 0) return "Out of Stock"
        if (this.stock <= 5) return "Limited Stock"
        return "In Stock"
      },
    },
  },
  {
    timestamps: true,
  },
)

// Update availability when stock changes
productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.availability = "Out of Stock"
  } else if (this.stock <= 5) {
    this.availability = "Limited Stock"
  } else {
    this.availability = "In Stock"
  }
  next()
})

module.exports = mongoose.model("Product", productSchema)
