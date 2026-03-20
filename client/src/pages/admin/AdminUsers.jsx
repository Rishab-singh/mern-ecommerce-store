import { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [page, setPage] = useState(1);
  const usersPerPage = 10; // 🔥 now 10 users per page

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.get("/users");
      const allUsers = data.users || data;

      setUsers(allUsers);
      setFilteredUsers(allUsers);

    } catch {
      setMessage("Failed to load users");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOAD USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    let temp = [...users];

    // search filter
    if (search.trim()) {
      temp = temp.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // role filter
    if (role) {
      temp = temp.filter((u) => u.role === role);
    }

    setFilteredUsers(temp);
    setPage(1); // reset page when filter changes

  }, [search, role, users]);

  // ================= PAGINATION =================
  const indexOfLast = page * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ================= DELETE =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));

      setMessage("User deleted successfully");
      setType("success");

    } catch {
      setMessage("Failed to delete user");
      setType("error");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex gap-4 justify-between items-center mb-6 flex-wrap">
        <h2 className="text-2xl font-bold">Users</h2>

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

        </div>
      </div>

      {/* Message */}
      {message && <Message type={type} text={message} />}

      {/* Count */}
      <p className="text-sm text-gray-500 mb-2">
        {filteredUsers.length} users found
      </p>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  <Loader />
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No matching users
                </td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr key={u._id} className="border-t">

                  <td className="py-4 px-6">{u.name}</td>
                  <td className="py-4 px-6">{u.email}</td>

                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 text-xs rounded ${
                      u.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages).keys()].map((x) => (
          <button
            key={x}
            onClick={() => setPage(x + 1)}
            className={`px-3 py-1 border rounded ${
              page === x + 1 ? "bg-black text-white" : ""
            }`}
          >
            {x + 1}
          </button>
        ))}
      </div>

    </div>
  );
}