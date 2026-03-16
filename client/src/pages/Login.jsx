import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const navigate = useNavigate();

const submitHandler = async (e)=>{
  e.preventDefault();
  setError("");

  try{

    setLoading(true);

    const {data} = await API.post("/auth/login",{email,password});

    localStorage.setItem("user",JSON.stringify(data));

    navigate("/");

  }catch(err){

    setError(err.response?.data?.message || "Login failed");

  }finally{
    setLoading(false);
  }
};

return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black">

<div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">

<h2 className="text-3xl font-semibold text-white text-center mb-6">
Welcome Back
</h2>

{error && (
<p className="text-red-400 text-sm text-center mb-4">
{error}
</p>
)}

<form onSubmit={submitHandler} className="space-y-4">

<input
type="email"
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

<input
type="password"
placeholder="Enter password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

<button
type="submit"
disabled={loading}
className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-3 font-medium text-white"
>
{loading ? "Signing in..." : "Login"}
</button>

</form>

<div className="text-center text-gray-300 mt-6 text-sm">

<p>
Don't have an account?{" "}
<Link to="/register" className="text-indigo-400 hover:underline">
Register
</Link>
</p>

<p className="mt-2">
<Link to="/forgot-password" className="text-indigo-400 hover:underline">
Forgot Password?
</Link>
</p>

</div>

</div>

</div>

);
}