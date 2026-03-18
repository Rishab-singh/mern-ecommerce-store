import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { categories } from "../constants/categories";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { motion } from "framer-motion";
import { Search, Filter, ShoppingCart } from "lucide-react";

export default function Products() {

const [products,setProducts] = useState([]);
const [loading,setLoading] = useState(false);

const [message,setMessage] = useState("");
const [type,setType] = useState("");

const [search,setSearch] = useState("");
const [debouncedSearch,setDebouncedSearch] = useState("");

const [category,setCategory] = useState("");
const [maxPrice,setMaxPrice] = useState("");

const [page,setPage] = useState(1);
const [pages,setPages] = useState(1);

const navigate = useNavigate();



/* Debounce search */

useEffect(()=>{

const timer = setTimeout(()=>{
setDebouncedSearch(search);
},500);

return ()=>clearTimeout(timer);

},[search]);



/* Fetch products */

useEffect(()=>{

const fetchProducts = async()=>{

try{

setLoading(true);
setMessage("");

const {data} = await API.get("/products",{
params:{
search:debouncedSearch,
category,
maxPrice,
page,
limit:8
}
});

setProducts(data.products);
setPages(data.pages);

}catch(err){

setType("error");
setMessage("Failed to load products");

}finally{

setLoading(false);

}

};

fetchProducts();

},[debouncedSearch,category,maxPrice,page]);



/* Add to cart */

const addToCart = async(id)=>{

try{

await API.post("/cart",{
productId:id,
quantity:1
});

setType("success");
setMessage("Product added to cart");

}catch(err){

navigate("/login");

}

};



return(

<div className="max-w-7xl mx-auto px-6 py-10">

<h2 className="text-4xl font-bold text-center mb-10">
Explore Products
</h2>

{message && <Message type={type} text={message} />}



{/* SEARCH + FILTERS */}

<div className="bg-white border rounded-xl shadow p-5 mb-10 flex flex-wrap gap-4 items-center justify-center">

{/* Search */}

<div className="relative">

<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

<input
type="text"
placeholder="Search products..."
value={search}
onChange={(e)=>{
setPage(1);
setSearch(e.target.value);
}}
className="border pl-10 pr-4 py-2 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-black"
/>

</div>



{/* Category */}

<select
value={category}
onChange={(e)=>{
setPage(1);
setCategory(e.target.value);
}}
className="border p-2 rounded-lg"
>

<option value="">All Categories</option>

{categories.map((cat)=>(

<option key={cat} value={cat}>
{cat}
</option>

))}

</select>



{/* Price */}

<input
type="number"
placeholder="Max Price"
value={maxPrice}
onChange={(e)=>{
setPage(1);
setMaxPrice(e.target.value);
}}
className="border p-2 rounded-lg w-40"
/>



<button
onClick={()=>{
setCategory("");
setMaxPrice("");
setSearch("");
}}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
>

<Filter size={16}/>
Reset Filters

</button>

</div>



{/* PRODUCT GRID */}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

{loading ? (

<div className="col-span-full flex justify-center">
<Loader/>
</div>

) : products.length === 0 ? (

<p className="col-span-full text-center text-gray-500">
No products found
</p>

) : (

products.map((p)=>(

<motion.div
key={p._id}
whileHover={{y:-6}}
className="bg-white border rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden cursor-pointer flex flex-col"
onClick={()=>navigate(`/product/${p._id}`)}
>



{/* Image */}

<div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">

<img
src={p.image || "https://via.placeholder.com/300"}
alt={p.name}
className="object-cover h-full w-full"
/>

</div>



{/* Content */}

<div className="p-4 flex flex-col flex-1">

<h3 className="font-semibold text-lg">
{p.name}
</h3>

<p className="text-gray-500 text-sm mt-1 line-clamp-2">
{p.description}
</p>

<p className="text-2xl font-bold mt-3">
₹{p.price}
</p>



<button
onClick={(e)=>{
e.stopPropagation();
addToCart(p._id);
}}
className="mt-auto flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
>

<ShoppingCart size={16}/>
Add to Cart

</button>

</div>

</motion.div>

))

)}

</div>



{/* PAGINATION */}

<div className="flex justify-center mt-12 gap-2 flex-wrap">

{[...Array(pages).keys()].map((x)=>(

<button
key={x+1}
onClick={()=>setPage(x+1)}
className={`px-4 py-2 rounded-lg border transition ${
page===x+1
? "bg-black text-white"
: "bg-white hover:bg-gray-100"
}`}
>

{x+1}

</button>

))}

</div>

</div>

);

}