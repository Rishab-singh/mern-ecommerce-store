import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
Mail,
Lock,
User,
UserPlus,
Loader2,
Eye,
EyeOff,
AlertTriangle
} from "lucide-react";

import API from "../services/api";

export default function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [showPassword,setShowPassword] = useState(false);

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const navigate = useNavigate();

const submitHandler = async(e)=>{

e.preventDefault();

setError("");
setLoading(true);

try{

await API.post("/auth/register",{name,email,password});

setTimeout(()=>{
navigate("/login");
},1200);

}catch(err){

setError(err.response?.data?.message || "Registration failed");

}finally{
setLoading(false);
}

};

return(

<div className="fixed inset-0 flex items-center justify-center overflow-hidden">

{/* Background */}

<div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80"/>

{/* Glow blobs */}

<div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[180px] rounded-full top-[-200px] left-[-200px] animate-pulse"/>

<div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[160px] rounded-full bottom-[-150px] right-[-150px] animate-pulse"/>

{/* Floating particles */}

{[...Array(20)].map((_,i)=>(

<motion.div
key={i}
className="absolute w-1 h-1 bg-white rounded-full opacity-30"
initial={{y:0,opacity:0}}
animate={{y:-800,opacity:[0,1,0]}}
transition={{
duration:10 + Math.random()*10,
repeat:Infinity,
delay:Math.random()*5
}}
style={{
left:`${Math.random()*100}%`,
bottom:"-20px"
}}
/>

))}

{/* Register Card */}

<motion.div
initial={{opacity:0,y:40,scale:.95}}
animate={{opacity:1,y:0,scale:1}}
transition={{duration:.6}}
className="relative z-10 w-full max-w-md p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.7)]"
>

{/* Logo */}

<div className="flex items-center justify-center gap-2 mb-6">

<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
M
</div>

<h1 className="text-xl font-semibold text-white">
MERN Store
</h1>

</div>

<h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
Create Account
</h2>

<p className="text-center text-gray-400 mb-6">
Join and start shopping today
</p>

{/* Error UI */}

<AnimatePresence>

{error && (

<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className="flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg p-3 mb-4"
>

<AlertTriangle size={18}/>
<span>{error}</span>

</motion.div>

)}

</AnimatePresence>

<form onSubmit={submitHandler} className="space-y-5">

{/* Name */}

<div className="relative">

<User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

<input
type="text"
required
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-indigo-400 outline-none"
/>

</div>

{/* Email */}

<div className="relative">

<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

<input
type="email"
required
placeholder="Email address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-indigo-400 outline-none"
/>

</div>

{/* Password */}

<div className="relative">

<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

<input
type={showPassword ? "text" : "password"}
required
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-indigo-400 outline-none"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
>

{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

</button>

</div>

{/* Register Button */}

<motion.button
whileHover={{
scale:1.04,
boxShadow:"0 10px 25px rgba(99,102,241,0.4)"
}}
whileTap={{scale:.97}}
type="submit"
disabled={loading}
className="relative w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold overflow-hidden"
>

<span className="relative flex items-center justify-center gap-2">

{loading ? (

<>
<Loader2 className="animate-spin"/>
Creating account...
</>

) : (

<>
Register
<UserPlus/>
</>

)}

</span>

</motion.button>

</form>

{/* Divider */}

<div className="flex items-center gap-3 my-6">

<div className="flex-1 h-px bg-white/20"/>

<span className="text-gray-400 text-sm">
OR
</span>

<div className="flex-1 h-px bg-white/20"/>

</div>

{/* Google Signup */}

<button
className="w-full py-3 rounded-xl bg-white text-gray-800 font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition"
>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-5 h-5"
/>

Continue with Google

</button>

<p className="text-center text-gray-400 mt-6 text-sm">

Already have an account?{" "}

<Link
to="/login"
className="text-indigo-400 hover:text-indigo-300"
>

Login

</Link>

</p>

</motion.div>

</div>

);

}