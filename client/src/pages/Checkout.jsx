import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Checkout() {

  const navigate = useNavigate();

  const [address,setAddress] = useState("");
  const [city,setCity] = useState("");
  const [postalCode,setPostalCode] = useState("");
  const [phone,setPhone] = useState("");
  const [paymentMethod,setPaymentMethod] = useState("COD");

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [type,setType] = useState("");

  const placeOrder = async () => {

    if(!address || !city || !postalCode || !phone){
      setType("error");
      setMessage("Please fill all fields");
      return;
    }

    try{

      setLoading(true);
      setMessage("");

      await API.post("/orders",{
        shippingAddress:{
          address,
          city,
          postalCode,
          country:"India",
          phone
        },
        paymentMethod
      });

      setType("success");
      setMessage("Order placed successfully ✅");

      setTimeout(()=>{
        navigate("/orders");
      },1200);

    }catch(error){

      setType("error");
      setMessage("Order failed ❌");

    }finally{
      setLoading(false);
    }

  };

  if(loading) return <Loader />;

  return(

    <div className="max-w-xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Checkout
      </h2>

      {message && <Message type={type} text={message} />}

      <div className="bg-white shadow p-6 rounded">

        <h3 className="font-semibold mb-3">
          Shipping Address
        </h3>

        <input
          type="text"
          placeholder="Address"
          className="border p-2 w-full mb-3"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="border p-2 w-full mb-3"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="border p-2 w-full mb-3"
          value={postalCode}
          onChange={(e)=>setPostalCode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="border p-2 w-full mb-5"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <h3 className="font-semibold mb-3">
          Payment Method
        </h3>

        <label className="block mb-2">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod==="COD"}
            onChange={(e)=>setPaymentMethod(e.target.value)}
          />
          Cash On Delivery
        </label>

        <label className="block mb-4">
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod==="UPI"}
            onChange={(e)=>setPaymentMethod(e.target.value)}
          />
          UPI Payment
        </label>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded w-full hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>

    </div>

  );
}