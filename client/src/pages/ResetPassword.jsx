import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ResetPassword(){

const {token} = useParams();
const navigate = useNavigate();

const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [message,setMessage] = useState("");
const [type,setType] = useState("");

const submitHandler = async (e)=>{
e.preventDefault();

try{

setLoading(true);
setMessage("");

await API.post(`/auth/reset-password/${token}`,{password});

setType("success");
setMessage("Password reset successful ✅");

setTimeout(()=>{
  navigate("/login");
},1200);

}catch(error){

setType("error");
setMessage("Reset failed");

}finally{
setLoading(false);
}

};

return(

<div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">

<h2 className="text-2xl font-bold mb-4 text-center">
Reset Password
</h2>

{loading && <Loader />}

{message && <Message type={type} text={message} />}

<form onSubmit={submitHandler} className="space-y-4">

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border p-2 rounded"
/>

<button
disabled={loading}
className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
>
{loading ? "Updating..." : "Update Password"}
</button>

</form>

</div>

);

}