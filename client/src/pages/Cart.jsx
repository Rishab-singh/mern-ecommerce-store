import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart(){

const [cart,setCart] = useState(null);
const [loading,setLoading] = useState(true);
const [message,setMessage] = useState("");
const [type,setType] = useState("");

const navigate = useNavigate();

const fetchCart = async()=>{

try{

setLoading(true);
setMessage("");

const user = JSON.parse(localStorage.getItem("user"));

if(!user){
navigate("/login");
return;
}

const {data} = await API.get("/cart");

setCart(data);

}catch(err){

setType("error");
setMessage("Failed to load cart");

}finally{
setLoading(false);
}

};

useEffect(()=>{
fetchCart();
},[]);



const removeItem = async(productId)=>{

try{

setLoading(true);

await API.delete(`/cart/${productId}`);

setType("success");
setMessage("Item removed");

fetchCart();

}catch(err){

setType("error");
setMessage("Failed to remove item");
setLoading(false);

}

};



const updateQuantity = async(productId,quantity)=>{

try{

if(quantity < 1) return;

setLoading(true);

await API.put("/cart",{
productId,
quantity
});

fetchCart();

}catch(err){

setType("error");
setMessage("Failed to update quantity");
setLoading(false);

}

};



const checkoutHandler = ()=>{
navigate("/checkout");
};



if(loading) return <Loader/>;



const total = cart?.items?.reduce(
(acc,item)=>acc + (item.product?.price || 0) * item.quantity,
0
);



return(

<div className="max-w-7xl mx-auto px-6 py-10">

<h2 className="text-4xl font-bold text-center mb-10">
Your Cart
</h2>

{message && <Message type={type} text={message}/>}



{!cart || cart.items.length === 0 ? (

<div className="text-center py-20 text-gray-500">

<ShoppingBag size={60} className="mx-auto mb-4 text-gray-400"/>

<p className="text-lg">
Your cart is empty
</p>

<button
onClick={()=>navigate("/")}
className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
>
Browse Products
</button>

</div>

) : (

<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

{/* CART ITEMS */}

<div className="lg:col-span-2 space-y-5">

{cart.items.map((item)=>(

<motion.div
key={item.product?._id}
whileHover={{scale:1.01}}
className="flex items-center gap-6 bg-white border rounded-xl shadow-sm hover:shadow-lg p-5"
>

{/* Image */}

<img
src={item.product?.image}
alt={item.product?.name}
className="w-24 h-24 object-cover rounded cursor-pointer"
onClick={()=>navigate(`/product/${item.product._id}`)}
/>

{/* Details */}

<div className="flex-1">

<h3
className="font-semibold text-lg cursor-pointer hover:underline"
onClick={()=>navigate(`/product/${item.product._id}`)}
>
{item.product?.name}
</h3>

<p className="text-gray-500 text-sm">
₹{item.product?.price}
</p>



{/* Quantity */}

<div className="flex items-center gap-3 mt-3">

<button
onClick={()=>updateQuantity(item.product._id,item.quantity-1)}
className="p-1 border rounded hover:bg-gray-100"
>
<Minus size={16}/>
</button>

<span className="font-semibold">
{item.quantity}
</span>

<button
onClick={()=>updateQuantity(item.product._id,item.quantity+1)}
className="p-1 border rounded hover:bg-gray-100"
>
<Plus size={16}/>
</button>

</div>

</div>



{/* Remove */}

<button
onClick={()=>removeItem(item.product._id)}
className="text-red-500 hover:text-red-600"
>
<Trash2 size={20}/>
</button>

</motion.div>

))}

</div>



{/* SUMMARY */}

<div className="bg-white border rounded-xl shadow-sm p-6 h-fit sticky top-24">

<h3 className="text-xl font-semibold mb-6">
Order Summary
</h3>

<div className="flex justify-between mb-3 text-gray-600">
<span>Items</span>
<span>{cart.items.length}</span>
</div>

<div className="flex justify-between mb-3 text-gray-600">
<span>Subtotal</span>
<span>₹{total}</span>
</div>

<div className="flex justify-between mb-6 text-gray-600">
<span>Shipping</span>
<span>Free</span>
</div>

<hr className="mb-4"/>

<div className="flex justify-between text-lg font-bold mb-6">
<span>Total</span>
<span>₹{total}</span>
</div>

<button
onClick={checkoutHandler}
className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
>
Proceed to Checkout
</button>

</div>

</div>

)}

</div>

);

}