import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminLayout() {

  const location = useLocation();

  const navItem = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="flex w-full h-screen overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 min-w-64 bg-gray-900 text-white flex flex-col">

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link to="/admin" className={navItem("/admin")}>
            <LayoutDashboard size={18}/> Dashboard
          </Link>

          <Link to="/admin/products" className={navItem("/admin/products")}>
            <Package size={18}/> Products
          </Link>

          <Link to="/admin/orders" className={navItem("/admin/orders")}>
            <ShoppingCart size={18}/> Orders
          </Link>

          <Link to="/admin/users" className={navItem("/admin/users")}>
            <Users size={18}/> Users
          </Link>

        </nav>

      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 bg-gray-100">
          <Outlet />
        </main>

      </div>

    </div>
  );
}