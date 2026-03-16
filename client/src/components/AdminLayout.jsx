import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-56 bg-gray-900 text-white p-5">

        <h2 className="text-2xl font-bold mb-6">Admin</h2>

        <ul className="space-y-4">

          <li>
            <Link to="/admin" className="block hover:text-gray-300">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/products" className="block hover:text-gray-300">
              Products
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" className="block hover:text-gray-300">
              Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/users" className="block hover:text-gray-300">
              Users
            </Link>
          </li>

        </ul>

      </div>

      {/* Page Content */}
      <div className="flex-1 p-8">

        {/* This keeps all pages same width */}
        <div className="max-w-6xl mx-auto">

          {children}

        </div>

      </div>

    </div>
  );
}