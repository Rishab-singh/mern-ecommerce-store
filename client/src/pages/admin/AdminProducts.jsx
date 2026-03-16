import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const fetchProducts = async () => {

    try {

      setLoading(true);
      setMessage("");

      const { data } = await API.get("/products?limit=1000");

      setProducts(data.products);

    } catch (error) {

      setType("error");
      setMessage("Failed to load products");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      setLoading(true);

      await API.delete(`/products/${id}`);

      setType("success");
      setMessage("Product deleted successfully");

      fetchProducts();

    } catch (error) {

      setType("error");
      setMessage("Failed to delete product");

    } finally {

      setLoading(false);

    }

  };



  return (

    <AdminLayout>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <Link
          to="/admin/products/add"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Add Product
        </Link>

      </div>

      {loading && <Loader />}
      {message && <Message type={type} text={message} />}



      <div className="bg-white rounded-lg shadow">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100 text-gray-700">

              <tr>

                <th className="py-3 px-6 text-left">
                  Product
                </th>

                <th className="py-3 px-6 text-center">
                  Price
                </th>

                <th className="py-3 px-6 text-center">
                  Stock
                </th>

                <th className="py-3 px-6 text-center">
                  Actions
                </th>

              </tr>

            </thead>



            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No products found
                  </td>
                </tr>

              ) : (

                products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="py-4 px-6">

                      <div className="flex items-center gap-4">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded"
                        />

                        <span className="font-medium">
                          {product.name}
                        </span>

                      </div>

                    </td>



                    <td className="py-4 px-6 text-center">
                      ₹{product.price}
                    </td>



                    <td className="py-4 px-6 text-center">
                      {product.countInStock}
                    </td>



                    <td className="py-4 px-6 text-center">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          disabled={loading}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>

  );

}