import { useState } from "react";
import { useParams,useNavigate,Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPassword(){

const {token} = useParams();
const navigate = useNavigate();

const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);

const [loading,setLoading] = useState(false);
const [message,setMessage] = useState("");
const [type,setType] = useState("");



const submitHandler = async(e)=>{

e.preventDefault();

try{

setLoading(true);
setMessage("");

await API.post(`/auth/reset-password/${token}`,{password});

setType("success");
setMessage("Password reset successful");

setTimeout(()=>{
navigate("/login");
},1500);

}catch(err){

setType("error");
setMessage("Reset failed");

}finally{

setLoading(false);

}

};



return(

<div className="fixed inset-0 flex items-center justify-center overflow-hidden">

{/* BACKGROUND */}

<div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80"/>

<div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[180px] rounded-full top-[-200px] left-[-200px] animate-pulse"/>

<div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[160px] rounded-full bottom-[-150px] right-[-150px] animate-pulse"/>



{/* FLOATING PARTICLES */}

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



{/* CARD */}

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
Reset Password
</h2>

<p className="text-center text-gray-400 mb-6">
Enter your new password
</p>



<AnimatePresence>

{message && (
<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
>
<Message type={type} text={message}/>
</motion.div>
)}

</AnimatePresence>



<form onSubmit={submitHandler} className="space-y-5">

{/* PASSWORD INPUT */}

<div className="relative">

<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

<input
type={showPassword ? "text" : "password"}
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
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



{/* BUTTON */}

<motion.button
whileHover={{
scale:1.04,
boxShadow:"0 10px 25px rgba(99,102,241,0.4)"
}}
whileTap={{scale:.97}}
type="submit"
disabled={loading}
className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2"
>

{loading ? (
<>
<Loader className="animate-spin"/>
Updating...
</>
):(
<>
Update Password
<KeyRound size={18}/>
</>
)}

</motion.button>

</form>



<p className="text-center text-gray-400 mt-6 text-sm">

Back to{" "}

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