import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="w-full min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>

    </div>
  );
}