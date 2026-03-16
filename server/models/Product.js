const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{ timestamps: true }
);

const productSchema = new mongoose.Schema(
{
  name: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },

  price: { 
    type: Number, 
    required: true 
  },

  category: { 
    type: String, 
    required: true 
  },

  countInStock: { 
    type: Number, 
    required: true, 
    default: 0 
  },

  image: { 
    type: String 
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reviews: [reviewSchema],   // ⭐ store reviews

  rating: {                  // ⭐ average rating
    type: Number,
    default: 0
  },

  numReviews: {              // ⭐ total reviews
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);