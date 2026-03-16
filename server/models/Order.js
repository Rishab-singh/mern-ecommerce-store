const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
{
 product:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Product",
  required:true
 },

 name:String,
 price:Number,
 quantity:Number,
 image:String
},
{_id:false}
);

const orderSchema = new mongoose.Schema(
{
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 orderItems:[orderItemSchema],

 shippingAddress:{
  address:String,
  city:String,
  postalCode:String,
  country:String,
  phone:String
 },

 totalAmount:{
  type:Number,
  required:true
 },

 paymentMethod:{
  type:String,
  enum:["COD","Razorpay","UPI"],
  default:"COD"
 },

 paymentStatus:{
  type:String,
  enum:["Pending","Paid","Failed"],
  default:"Pending"
 },

 paidAt:Date,

 orderStatus:{
  type:String,
  enum:["Pending","Processing","Shipped","Out for Delivery","Delivered"],
  default:"Pending"
 },

 // ⭐ ORDER TIMELINE
 statusTimeline:[
  {
   status:String,
   date:{
    type:Date,
    default:Date.now
   }
  }
 ],

 isDelivered:{
  type:Boolean,
  default:false
 },

 deliveredAt:Date

},
{timestamps:true}
);

module.exports = mongoose.model("Order",orderSchema);