import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Package, LogOut, Store } from "lucide-react";

export default function Navbar() {

const [user,setUser] = useState(null);
const navigate = useNavigate();
const location = useLocation();

useEffect(()=>{
const storedUser = JSON.parse(localStorage.getItem("user"));
setUser(storedUser);
},[location]);

const logoutHandler = ()=>{
localStorage.removeItem("user");
setUser(null);
navigate("/login");
};

const linkStyle = (path) =>
`flex items-center gap-1 transition ${
location.pathname === path
? "text-white"
: "text-gray-400 hover:text-white"
}`;

return (

<nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-950 via-gray-950 to-black border-b border-white/10 backdrop-blur-md">

<div className="max-w-7xl mx-auto px-6 py-2.5 flex justify-between items-center">

{/* Logo */}
<Link
to="/"
className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:scale-105 transition"
>

<Store className="text-indigo-400" size={20}/>

<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
Shop
</span>

</Link>

{/* Links */}
<div className="flex items-center gap-6 text-sm font-medium">

<Link to="/" className={linkStyle("/")}>
Products
</Link>

{user ? (

<>

<Link to="/cart" className={linkStyle("/cart")}>
<ShoppingCart size={17}/>
Cart
</Link>

<Link to="/orders" className={linkStyle("/orders")}>
<Package size={17}/>
Orders
</Link>

{user?.role === "admin" && (
<Link to="/admin" className={linkStyle("/admin")}>
Admin
</Link>
)}

<button
onClick={logoutHandler}
className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-white transition text-sm"
>

<LogOut size={16}/>
Logout

</button>

</>

) : (

<>

<Link to="/login" className={linkStyle("/login")}>
Login
</Link>

<Link
to="/register"
className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-md text-white transition text-sm"
>
Register
</Link>

</>

)}

</div>

</div>

</nav>

);
}