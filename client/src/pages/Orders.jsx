import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { Package, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Orders(){

const [orders,setOrders] = useState([]);
const [loading,setLoading] = useState(true);
const [message,setMessage] = useState("");
const [type,setType] = useState("");

const navigate = useNavigate();



useEffect(()=>{

const fetchOrders = async()=>{

try{

setLoading(true);
setMessage("");

const user = JSON.parse(localStorage.getItem("user"));

if(!user){
navigate("/login");
return;
}

const {data} = await API.get("/orders/my");

setOrders(data);

}catch(err){

setType("error");
setMessage("Failed to load orders");

}finally{

setLoading(false);

}

};

fetchOrders();

},[navigate]);



if(loading) return <Loader/>;



return(

<div className="max-w-6xl mx-auto px-6 py-10">

<h2 className="text-4xl font-bold text-center mb-10">
My Orders
</h2>

{message && <Message type={type} text={message}/>}



{orders.length === 0 ? (

<div className="text-center py-20 text-gray-500">

<Package size={60} className="mx-auto mb-4 text-gray-400"/>

<p className="text-lg">
You haven't placed any orders yet
</p>

<button
onClick={()=>navigate("/")}
className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
>
Browse Products
</button>

</div>

):(orders.map((order)=>(

<motion.div
key={order._id}
whileHover={{scale:1.01}}
className="bg-white border rounded-xl shadow-sm hover:shadow-lg p-6 mb-6"
>



{/* ORDER HEADER */}

<div className="flex flex-wrap justify-between gap-4 border-b pb-4 mb-4">

<div>

<p className="text-sm text-gray-500">
Order ID
</p>

<p className="font-semibold">
ORD-{order._id.slice(-6).toUpperCase()}
</p>

</div>



<div>

<p className="text-sm text-gray-500">
Date
</p>

<p className="font-medium">
{new Date(order.createdAt).toLocaleDateString()}
</p>

</div>



<div>

<p className="text-sm text-gray-500">
Total
</p>

<p className="font-semibold">
₹{order.totalAmount || 0}
</p>

</div>



{/* STATUS */}

<div>

<p className="text-sm text-gray-500">
Status
</p>

<span
className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit
${
order.orderStatus === "Delivered"
? "bg-green-100 text-green-700"
: order.orderStatus === "Shipped"
? "bg-blue-100 text-blue-700"
: "bg-yellow-100 text-yellow-700"
}`}
>

{order.orderStatus === "Delivered" && <CheckCircle size={14}/>}
{order.orderStatus === "Shipped" && <Truck size={14}/>}
{order.orderStatus === "Processing" && <Package size={14}/>}

{order.orderStatus}

</span>

</div>

</div>



{/* ORDER ITEMS */}

<div className="space-y-4">

{order.orderItems.map((item,index)=>(

<div
key={index}
className="flex items-center gap-4"
>



<img
src={item.image || "https://via.placeholder.com/100"}
alt={item.name}
className="w-16 h-16 object-cover rounded cursor-pointer"
onClick={()=>navigate(`/product/${item.product}`)}
/>



<div className="flex-1">

<p
className="font-medium cursor-pointer hover:underline"
onClick={()=>navigate(`/product/${item.product}`)}
>
{item.name}
</p>

<p className="text-sm text-gray-500">
{item.quantity} × ₹{item.price}
</p>

</div>

</div>

))}

</div>



{/* ACTIONS */}

<div className="flex justify-end mt-5">

<button
onClick={()=>navigate(`/track/${order._id}`)}
className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm transition"
>
Track Order
</button>

</div>

</motion.div>

)))}

</div>

);

}