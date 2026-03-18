import { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const fetchOrders = async () => {

    try {

      setLoading(true);
      setMessage("");

      const { data } = await API.get("/orders");
      setOrders(data);

    } catch (error) {

      setType("error");
      setMessage("Failed to load orders");

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {

    try {

      await API.put(`/orders/${id}/status`, { status });

      setType("success");
      setMessage("Order status updated");

      fetchOrders();

    } catch (error) {

      setType("error");
      setMessage("Failed to update order status");

    }

  };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Orders
      </h2>

      {/* Messages */}
      {loading && <Loader />}
      {message && <Message type={type} text={message} />}

      {/* Table */}
      <div className="bg-white rounded-lg shadow">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100 text-gray-700">

              <tr>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-center">Total</th>
                <th className="py-3 px-6 text-center">Payment</th>
                <th className="py-3 px-6 text-center">Order Status</th>
              </tr>

            </thead>

            <tbody>

              {orders.length === 0 ? (

                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No orders found
                  </td>
                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* User */}
                    <td className="py-4 px-6 font-medium">
                      {order.user?.name || "User"}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 text-center">
                      ₹{order.totalAmount}
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-6 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>

                    </td>

                    {/* Order Status */}
                    <td className="py-4 px-6 text-center">

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}