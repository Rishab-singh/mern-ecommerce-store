import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setMessage("");

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/login");
          return;
        }

        const { data } = await API.get("/orders/my");
        setOrders(data);

      } catch (err) {

        setType("error");
        setMessage("Failed to load orders");

      } finally {
        setLoading(false);
      }

    };

    fetchOrders();

  }, [navigate]);

  if (loading) return <Loader />;

  return (

    <div className="max-w-5xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-8 text-center">
        My Orders
      </h2>

      {message && <Message type={type} text={message} />}

      {orders.length === 0 ? (

        <p className="text-center text-gray-500">
          No orders found
        </p>

      ) : (

        orders.map((order) => (

          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 border"
          >

            {/* Order Header */}
            <div className="flex justify-between flex-wrap gap-4 mb-4 border-b pb-3">

              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-sm">
                  ORD-{order._id.slice(-6).toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">
                  ₹{order.totalAmount || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    order.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.orderStatus}
                </span>

              </div>

            </div>

            {/* Ordered Items */}
            <div className="space-y-4">

              {order.orderItems.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4"
                >

                  {/* Product Image */}
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => navigate(`/product/${item.product}`)}
                  />

                  {/* Product Info */}
                  <div className="flex-1">

                    <p
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/product/${item.product}`)}
                    >
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {item.quantity} × ₹{item.price}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Footer Actions */}
            <div className="flex justify-end mt-4 gap-3">

              <button
                onClick={() => navigate(`/track/${order._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Track Order
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  );

}