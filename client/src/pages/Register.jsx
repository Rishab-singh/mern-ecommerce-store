import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Register() {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [type, setType] = useState("");

const navigate = useNavigate();

const submitHandler = async (e) => {
e.preventDefault();

setMessage("");

try {

  setLoading(true);

  const { data } = await API.post("/auth/register", {
    name,
    email,
    password
  });

  setType("success");
  setMessage(
    data.message || "Registration successful. Please verify your email."
  );

  setTimeout(() => {
    navigate("/login");
  }, 1500);

} catch (err) {

  setType("error");
  setMessage(
    err.response?.data?.message || "Registration failed ❌"
  );

} finally {
  setLoading(false);
}

};

return (

<div className="flex items-center justify-center min-h-screen bg-gray-100">

  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

    <h2 className="text-2xl font-bold mb-6 text-center">
      Register
    </h2>

    {loading && <Loader />}

    {message && <Message type={type} text={message} />}

    <form onSubmit={submitHandler} className="space-y-4">

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

    </form>

    <p className="text-center mt-4 text-sm">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-600 hover:underline"
      >
        Login
      </Link>
    </p>

  </div>

</div>

);
}