import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");



  const fetchUsers = async () => {

    try {

      setLoading(true);
      setMessage("");

      const { data } = await API.get("/users", {
        params: {
          search,
          page,
          limit: 10
        }
      });

      // handle both array and paginated response
      if (Array.isArray(data)) {

        setUsers(data);
        setPages(1);

      } else {

        setUsers(data.users || []);
        setPages(data.pages || 1);

      }

    } catch (error) {

      setType("error");
      setMessage("Failed to load users");

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchUsers();

  }, [search, page]);



  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await API.delete(`/users/${id}`);

      setType("success");
      setMessage("User deleted successfully");

      fetchUsers();

    } catch (error) {

      setType("error");
      setMessage("Failed to delete user");

    }

  };



  return (

    <AdminLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Users
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>



      {loading && <Loader />}
      {message && <Message type={type} text={message} />}



      {/* Users Table */}

      <div className="bg-white rounded-lg shadow">

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* Header */}

            <thead className="bg-gray-100 text-gray-700">

              <tr>

                <th className="py-3 px-6 text-left">
                  Name
                </th>

                <th className="py-3 px-6 text-left">
                  Email
                </th>

                <th className="py-3 px-6 text-center">
                  Role
                </th>

                <th className="py-3 px-6 text-center">
                  Actions
                </th>

              </tr>

            </thead>



            {/* Body */}

            <tbody>

              {!users || users.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </td>

                </tr>

              ) : (

                users.map((u) => (

                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* Name */}

                    <td className="py-4 px-6 font-medium">
                      {u.name}
                    </td>



                    {/* Email */}

                    <td className="py-4 px-6 text-gray-600 break-all">
                      {u.email}
                    </td>



                    {/* Role */}

                    <td className="py-4 px-6 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          u.role === "admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>

                    </td>



                    {/* Actions */}

                    <td className="py-4 px-6 text-center">

                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
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

      </div>



      {/* Pagination */}

      <div className="flex justify-center mt-8 gap-2 flex-wrap">

        {[...Array(pages).keys()].map((x) => (

          <button
            key={x + 1}
            onClick={() => setPage(x + 1)}
            className={`px-4 py-2 border rounded ${
              page === x + 1
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {x + 1}
          </button>

        ))}

      </div>

    </AdminLayout>

  );

}