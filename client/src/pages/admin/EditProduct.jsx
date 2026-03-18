import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { categories } from "../../constants/categories";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function EditProduct() {

  const { id } = useParams();
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

  useEffect(() => {

    const fetchProduct = async () => {
      try {

        setLoading(true);

        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

      } catch (error) {

        setType("error");
        setMessage("Failed to load product");

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [id]);

  const updateProduct = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setMessage("");

      await API.put(`/products/${id}`, product);

      setType("success");
      setMessage("Product updated successfully ✅");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1200);

    } catch (error) {

      setType("error");
      setMessage("Update failed");

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Edit Product
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">

        <form
          onSubmit={updateProduct}
          className="space-y-4"
        >

          <input
            value={product.name}
            placeholder="Product Name"
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            value={product.description}
            placeholder="Description"
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            value={product.price}
            type="number"
            placeholder="Price"
            onChange={(e) =>
              setProduct({ ...product, price: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >

            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}

          </select>

          <input
            value={product.countInStock}
            type="number"
            placeholder="Stock"
            onChange={(e) =>
              setProduct({ ...product, countInStock: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            value={product.image}
            placeholder="Image URL"
            onChange={(e) =>
              setProduct({ ...product, image: e.target.value })
            }
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

        </form>

      </div>

    </div>
  );
}