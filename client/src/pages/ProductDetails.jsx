import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetails() {

const { id } = useParams();
const navigate = useNavigate();

const [product,setProduct] = useState(null);
const [relatedProducts,setRelatedProducts] = useState([]);

const [rating,setRating] = useState(0);
const [hover,setHover] = useState(0);
const [comment,setComment] = useState("");

const [loading,setLoading] = useState(true);
const [zoom,setZoom] = useState(false);

const [message,setMessage] = useState("");
const [type,setType] = useState("");



useEffect(()=>{
if(id) fetchProduct();
},[id]);



const fetchProduct = async()=>{

try{

setLoading(true);
setMessage("");

const res = await API.get(`/products/${id}`);
const productData = res.data;

setProduct(productData);



/* related products */

try{

const list = await API.get("/products");

const productsArray = list.data?.products || [];

const related = productsArray.filter(
(p)=>p.category === productData.category && p._id !== productData._id
);

setRelatedProducts(related.slice(0,4));

}catch(err){
console.log(err);
}

}catch(err){

setType("error");
setMessage("Failed to load product");

}finally{

setLoading(false);

}

};



const addToCart = async()=>{

try{

await API.post("/cart",{
productId:id,
quantity:1
});

setType("success");
setMessage("Added to cart");

}catch(err){

navigate("/login");

}

};



const submitReview = async(e)=>{

e.preventDefault();

if(rating === 0){
setType("error");
setMessage("Please select rating");
return;
}

try{

await API.post(`/products/${id}/reviews`,{
rating,
comment
});

setType("success");
setMessage("Review submitted");

setRating(0);
setComment("");

fetchProduct();

}catch(err){

setType("error");
setMessage(err.response?.data?.message || "Review failed");

}

};



const renderStars=(value)=>{

const stars=[];

for(let i=1;i<=5;i++){

stars.push(
<span key={i}>
{value>=i ? "⭐":"☆"}
</span>
);

}

return stars;

};



if(loading) return <Loader/>;

if(!product) return <Message type="error" text="Product not found"/>;



return(

<div className="max-w-7xl mx-auto px-6 py-10">

{message && <Message type={type} text={message}/>}



{/* PRODUCT SECTION */}

<div className="grid md:grid-cols-2 gap-12 items-start">



{/* IMAGE */}

<div
className="bg-white rounded-xl border overflow-hidden shadow-sm"
onMouseEnter={()=>setZoom(true)}
onMouseLeave={()=>setZoom(false)}
>

<img
src={product.image || "https://via.placeholder.com/500"}
alt={product.name}
className={`w-full transition-transform duration-300 ${
zoom ? "scale-125":"scale-100"
}`}
/>

</div>



{/* PRODUCT INFO */}

<div className="space-y-4">

<h1 className="text-3xl font-bold">
{product.name}
</h1>

<p className="text-gray-600">
{product.description}
</p>



<div className="text-yellow-500 text-lg">
{renderStars(product.rating || 0)}
</div>

<p className="text-sm text-gray-500">
{product.numReviews || 0} reviews
</p>



<p className="text-3xl font-bold">
₹{product.price}
</p>



{/* STOCK */}

{product.countInStock > 5 && (
<p className="text-green-600 font-semibold">
In Stock
</p>
)}

{product.countInStock > 0 && product.countInStock <= 5 && (
<p className="text-yellow-600 font-semibold">
Only {product.countInStock} left
</p>
)}

{product.countInStock === 0 && (
<p className="text-red-600 font-semibold">
Out of Stock
</p>
)}



<button
onClick={addToCart}
className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
>

<ShoppingCart size={18}/>
Add to Cart

</button>



{/* REVIEW FORM */}

<div className="border-t pt-6">

<h3 className="text-lg font-semibold mb-3">
Write a Review
</h3>

<form
onSubmit={submitReview}
className="flex flex-col gap-3"
>

<div className="flex gap-2 text-3xl">

{[1,2,3,4,5].map((star)=>(

<span
key={star}
className={`cursor-pointer ${
(hover || rating) >= star
? "text-yellow-500"
: "text-gray-300"
}`}
onClick={()=>setRating(star)}
onMouseEnter={()=>setHover(star)}
onMouseLeave={()=>setHover(0)}
>
★
</span>

))}

</div>

<textarea
placeholder="Write your review"
value={comment}
onChange={(e)=>setComment(e.target.value)}
className="border rounded p-2"
/>

<button
type="submit"
className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
>
Submit Review
</button>

</form>

</div>

</div>

</div>



{/* REVIEWS */}

<div className="mt-16">

<h2 className="text-2xl font-bold mb-6">
Customer Reviews
</h2>

{!product.reviews || product.reviews.length === 0 ? (

<p className="text-gray-500">
No reviews yet
</p>

):(product.reviews.map((review)=>(

<div
key={review._id}
className="border-b py-4"
>

<strong>{review.name}</strong>

<div className="text-yellow-500">
{renderStars(review.rating)}
</div>

<p className="text-gray-600">
{review.comment}
</p>

</div>

)))}

</div>



{/* RELATED PRODUCTS */}

<div className="mt-16">

<h2 className="text-2xl font-bold mb-6">
Related Products
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

{relatedProducts.length === 0 && (
<p className="text-gray-500">
No related products
</p>
)}

{relatedProducts.map((p)=>(

<motion.div
key={p._id}
whileHover={{y:-5}}
onClick={()=>navigate(`/product/${p._id}`)}
className="bg-white border rounded-xl shadow-sm hover:shadow-lg p-3 cursor-pointer"
>

<img
src={p.image || "https://via.placeholder.com/200"}
className="h-32 w-full object-cover rounded"
alt={p.name}
/>

<p className="font-semibold mt-2">
{p.name}
</p>

<p className="text-sm text-gray-600">
₹{p.price}
</p>

</motion.div>

))}

</div>

</div>

</div>

);

}