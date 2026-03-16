import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        🛍 Shop
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">

        <Link to="/" className="hover:text-gray-300 transition">
          Products
        </Link>

        {user ? (
          <>
            <Link to="/cart" className="hover:text-gray-300 transition">
              Cart
            </Link>

            <Link to="/orders" className="hover:text-gray-300 transition">
              Orders
            </Link>

            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-gray-300 transition">
                Admin
              </Link>
            )}

            <button
              onClick={logoutHandler}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>

            <Link to="/register" className="hover:text-gray-300 transition">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}