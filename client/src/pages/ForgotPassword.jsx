import { useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ForgotPassword(){

const [email,setEmail] = useState("");
const [loading,setLoading] = useState(false);
const [message,setMessage] = useState("");
const [type,setType] = useState("");

const submitHandler = async (e)=>{
e.preventDefault();

try{

setLoading(true);
setMessage("");

const {data} = await API.post("/auth/forgot-password",{email});

setType("success");
setMessage(data.message);

}catch(error){

setType("error");
setMessage("Error sending reset email");

}finally{
setLoading(false);
}

};

return(

<div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">

<h2 className="text-2xl font-bold mb-4 text-center">
Forgot Password
</h2>

{loading && <Loader />}

{message && <Message type={type} text={message} />}

<form onSubmit={submitHandler} className="space-y-4">

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border p-2 rounded"
required
/>

<button
disabled={loading}
className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
>
{loading ? "Sending..." : "Send Reset Link"}
</button>

</form>

</div>

);

}