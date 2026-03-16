import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { categories } from "../constants/categories";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const navigate = useNavigate();



  // Debounce search
  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  }, [search]);



  // Fetch products from backend
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);
        setMessage("");

        const { data } = await API.get("/products", {
          params: {
            search: debouncedSearch,
            category,
            maxPrice,
            page,
            limit: 8
          }
        });

        setProducts(data.products);
        setPages(data.pages);

      } catch (err) {

        setType("error");
        setMessage("Failed to load products");

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, [debouncedSearch, category, maxPrice, page]);



  // Add to cart
  const addToCart = async (id) => {

    try {

      await API.post("/cart", {
        productId: id,
        quantity: 1
      });

      setType("success");
      setMessage("Product added to cart ✅");

    } catch (err) {

      navigate("/login");

    }

  };



  return (

    <div className="max-w-7xl mx-auto px-6 py-8">

      <h2 className="text-3xl font-bold text-center mb-8">
        Products
      </h2>

      {message && <Message type={type} text={message} />}



      {/* SEARCH + FILTERS */}

      <div className="flex flex-wrap gap-4 justify-center mb-10">

        {/* Search */}

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded w-56"
        />


        {/* Category Filter */}

        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="border p-2 rounded"
        >

          <option value="">
            All Categories
          </option>

          {categories.map((cat) => (

            <option key={cat} value={cat}>
              {cat}
            </option>

          ))}

        </select>


        {/* Price Filter */}

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setPage(1);
            setMaxPrice(e.target.value);
          }}
          className="border p-2 rounded w-40"
        />

      </div>



      {/* PRODUCT GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {loading ? (

          <div className="col-span-full flex justify-center">
            <Loader />
          </div>

        ) : products.length === 0 ? (

          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>

        ) : (

          products.map((p) => (

            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
            >

              <img
                src={p.image || "https://via.placeholder.com/300"}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />

              <div className="flex-1 mt-3">

                <h3 className="text-lg font-semibold">
                  {p.name}
                </h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>

              </div>

              <p className="text-xl font-bold mt-3">
                ₹{p.price}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p._id);
                }}
                className="mt-3 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

            </div>

          ))

        )}

      </div>



      {/* PAGINATION */}

      <div className="flex justify-center mt-10 gap-2 flex-wrap">

        {[...Array(pages).keys()].map((x) => (

          <button
            key={x + 1}
            onClick={() => setPage(x + 1)}
            className={`px-4 py-2 border rounded ${
              page === x + 1
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {x + 1}
          </button>

        ))}

      </div>

    </div>

  );

}