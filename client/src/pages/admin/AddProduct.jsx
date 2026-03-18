import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import { categories } from "../../constants/categories";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function AddProduct() {

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      setMessage("");

      await API.post("/products", product);

      setType("success");
      setMessage("Product created successfully ✅");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1200);

    } catch (error) {

      setType("error");
      setMessage(
        error.response?.data?.message || "Failed to create product"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Add Product
        </h2>

        <button
          onClick={() => navigate("/admin/products")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>

      </div>

      {/* Messages */}
      {loading && <Loader />}
      {message && <Message type={type} text={message} />}

      {/* Container */}
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">

        <form
          onSubmit={submitHandler}
          className="space-y-4"
        >

          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}

          </select>

          <input
            name="countInStock"
            type="number"
            placeholder="Stock"
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

      </div>
   </div>
    
  );
}