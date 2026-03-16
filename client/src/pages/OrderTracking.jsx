import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

import {
  FaBox,
  FaCogs,
  FaTruck,
  FaShippingFast,
  FaHome
} from "react-icons/fa";

export default function OrderTracking() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);

      } catch (error) {

        console.error("Failed to fetch order", error);

      } finally {
        setLoading(false);
      }

    };

    fetchOrder();

  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-500">
        Order not found
      </div>
    );
  }

  const steps = [
    { status: "Pending", icon: <FaBox /> },
    { status: "Processing", icon: <FaCogs /> },
    { status: "Shipped", icon: <FaTruck /> },
    { status: "Out for Delivery", icon: <FaShippingFast /> },
    { status: "Delivered", icon: <FaHome /> }
  ];

  const currentStepIndex = steps.findIndex(
    (s) => s.status === order.orderStatus
  );

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (

    <div className="max-w-5xl mx-auto p-6">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Order Tracking
      </h1>

      {/* Order Info */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

        <div className="flex flex-wrap justify-between gap-4">

          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-semibold">
              ORD-{order._id.slice(-6).toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Payment</p>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${
                order.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.paymentStatus}
            </span>

          </div>

          <div>
            <p className="text-gray-500">Status</p>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              {order.orderStatus}
            </span>

          </div>

        </div>

      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

        <p className="font-semibold mb-3">Delivery Progress</p>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progress)}% completed
        </p>

      </div>

      {/* Tracking Timeline */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-6">
          Tracking Timeline
        </h2>

        <div className="space-y-6">

          {steps.map((step, index) => {

            const stepIndex = steps.findIndex(
              (s) => s.status === step.status
            );

            const completed = stepIndex <= currentStepIndex;

            return (

              <div
                key={index}
                className="flex items-center gap-4"
              >

                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white
                  ${
                    completed
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  {step.icon}
                </div>

                <div>

                  <p className="font-semibold">
                    {step.status}
                  </p>

                  <p className="text-sm text-gray-500">
                    {completed ? "Completed" : "Pending"}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </div>

      {/* Estimated Delivery */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-3">
          Estimated Delivery
        </h2>

        <p className="text-lg font-medium text-green-600">
          {estimatedDelivery.toDateString()}
        </p>

      </div>

      {/* Ordered Products */}
      <div className="bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Ordered Products
        </h2>

        <div className="space-y-4">

          {order.orderItems.map((item) => (

            <div
              key={item.product}
              className="flex items-center gap-4 border-b pb-4"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">

                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>

              </div>

              <p className="font-semibold">
                ₹{item.price}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}