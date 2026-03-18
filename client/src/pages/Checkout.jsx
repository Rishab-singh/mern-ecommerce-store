import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { MapPin, Phone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout(){

const navigate = useNavigate();

const [address,setAddress] = useState("");
const [city,setCity] = useState("");
const [postalCode,setPostalCode] = useState("");
const [phone,setPhone] = useState("");
const [paymentMethod,setPaymentMethod] = useState("COD");

const [loading,setLoading] = useState(false);
const [message,setMessage] = useState("");
const [type,setType] = useState("");



const placeOrder = async()=>{

if(!address || !city || !postalCode || !phone){

setType("error");
setMessage("Please fill all fields");
return;

}

try{

setLoading(true);
setMessage("");

await API.post("/orders",{

shippingAddress:{
address,
city,
postalCode,
country:"India",
phone
},

paymentMethod

});

setType("success");
setMessage("Order placed successfully");

setTimeout(()=>{
navigate("/orders");
},1200);

}catch(err){

setType("error");
setMessage("Order failed");

}finally{

setLoading(false);

}

};



if(loading) return <Loader/>;



return(

<div className="max-w-4xl mx-auto px-6 py-10">

<h2 className="text-4xl font-bold text-center mb-10">
Checkout
</h2>

{message && <Message type={type} text={message}/>}



<div className="bg-white border rounded-xl shadow-sm p-8 space-y-8">



{/* SHIPPING ADDRESS */}

<div>

<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
<MapPin size={18}/> Shipping Address
</h3>

<div className="grid md:grid-cols-2 gap-4">

<input
type="text"
placeholder="Address"
className="border p-3 rounded-lg"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

<input
type="text"
placeholder="City"
className="border p-3 rounded-lg"
value={city}
onChange={(e)=>setCity(e.target.value)}
/>

<input
type="text"
placeholder="Postal Code"
className="border p-3 rounded-lg"
value={postalCode}
onChange={(e)=>setPostalCode(e.target.value)}
/>

<input
type="text"
placeholder="Phone Number"
className="border p-3 rounded-lg"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

</div>

</div>



{/* PAYMENT METHOD */}

<div>

<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
<CreditCard size={18}/> Payment Method
</h3>



<div className="space-y-3">

<label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">

<input
type="radio"
value="COD"
checked={paymentMethod==="COD"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>

Cash On Delivery

</label>



<label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">

<input
type="radio"
value="UPI"
checked={paymentMethod==="UPI"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>

UPI Payment

</label>

</div>

</div>



{/* PLACE ORDER */}

<motion.button
whileHover={{scale:1.03}}
whileTap={{scale:.97}}
onClick={placeOrder}
disabled={loading}
className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
>

{loading ? "Placing Order..." : "Place Order"}

</motion.button>



</div>

</div>

);

}