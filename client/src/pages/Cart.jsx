import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Cart() {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {

      setLoading(true);
      setMessage("");

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/login");
        return;
      }

      const { data } = await API.get("/cart");
      setCart(data);

    } catch (error) {

      setType("error");
      setMessage("Failed to load cart");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {

      setLoading(true);

      await API.delete(`/cart/${productId}`);

      setType("success");
      setMessage("Item removed from cart");

      fetchCart();

    } catch (error) {

      setType("error");
      setMessage("Failed to remove item");

      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {

      if (quantity < 1) return;

      setLoading(true);

      await API.put("/cart", {
        productId,
        quantity,
      });

      setType("success");
      setMessage("Cart updated");

      fetchCart();

    } catch (error) {

      setType("error");
      setMessage("Failed to update quantity");

      setLoading(false);
    }
  };

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6 text-center">
        My Cart
      </h2>

      {message && <Message type={type} text={message} />}

      {!cart || !cart.items || cart.items.length === 0 ? (

        <p className="text-center text-gray-500">
          Your cart is empty
        </p>

      ) : (

        <>
          {cart.items.map((item) => (

            <div
              key={item.product?._id}
              className="flex items-center gap-6 bg-white shadow rounded-lg p-5 mb-4"
            >

              {/* Product Image */}
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/product/${item.product._id}`)}
              />

              {/* Product Details */}
              <div className="flex-1">

                <h3
                  className="text-lg font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                >
                  {item.product?.name}
                </h3>

                <p className="text-gray-600">
                  Price: ₹{item.product?.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-3">

                  <button
                    className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700"
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span className="font-semibold text-lg">
                    {item.quantity}
                  </span>

                  <button
                    className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700"
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                </div>

                {/* Remove Button */}
                <button
                  className="mt-3 text-red-500 hover:underline"
                  onClick={() => removeItem(item.product._id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          {/* Total Section */}
          <div className="text-right mt-6">

            <h3 className="text-xl font-bold mb-3">
              Total: ₹
              {cart.items.reduce(
                (acc, item) =>
                  acc + (item.product?.price || 0) * item.quantity,
                0
              )}
            </h3>

            <button
              onClick={checkoutHandler}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>

          </div>

        </>
      )}

    </div>
  );
}