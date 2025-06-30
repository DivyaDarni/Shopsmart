const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Card"],
      default: "COD",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    trackingInfo: {
      status: { type: String, default: "Order Placed" },
      updates: [
        {
          status: String,
          timestamp: { type: Date, default: Date.now },
          description: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

// Generate order ID before saving
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD" + Date.now() + Math.floor(Math.random() * 1000)
  }
  next()
})

module.exports = mongoose.model("Order", orderSchema)
