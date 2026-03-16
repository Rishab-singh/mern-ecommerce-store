import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

/* ================= FORMAT CURRENCY ================= */

function formatCurrency(num) {

  if (num >= 1000000) {
    return `₹${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }

  return `₹${num}`;
}

export default function Dashboard() {

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    avgOrder: 0
  });

  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const usersRes = await API.get("/users");
        const productsRes = await API.get("/products?limit=1000");
        const ordersRes = await API.get("/orders");

        const users = usersRes.data;

        // ✅ FIX HERE
        const products = productsRes.data.products;

        const ordersData = ordersRes.data;

        /* ================= REVENUE ================= */

        const revenue = ordersData.reduce(
          (acc, order) => acc + (order.totalAmount || 0),
          0
        );

        const avgOrder = ordersData.length
          ? revenue / ordersData.length
          : 0;

        setStats({
          users: users.length,
          products: products.length,
          orders: ordersData.length,
          revenue,
          avgOrder
        });

        setOrders(ordersData.slice(0, 6));

        /* ================= TOP PRODUCTS ================= */

        const sales = {};

        ordersData.forEach(order => {

          order.orderItems.forEach(item => {

            if (!sales[item.name]) {
              sales[item.name] = 0;
            }

            sales[item.name] += item.quantity;

          });

        });

        const top = Object.keys(sales).map(name => ({
          name,
          sold: sales[name]
        }));

        top.sort((a, b) => b.sold - a.sold);

        setTopProducts(top.slice(0, 5));

        /* ================= MONTHLY REVENUE ================= */

        const monthly = {};

        ordersData.forEach(order => {

          const month = new Date(order.createdAt)
            .toLocaleString("default", { month: "short" });

          if (!monthly[month]) {
            monthly[month] = 0;
          }

          monthly[month] += order.totalAmount;

        });

        const monthlyData = Object.keys(monthly).map(m => ({
          month: m,
          revenue: monthly[m]
        }));

        setMonthlyRevenue(monthlyData);

        /* ================= LOW STOCK ================= */

        const lowStockProducts = products.filter(
          p => p.countInStock < 5
        );

        setLowStock(lowStockProducts);

      } catch (error) {

        console.error(error);

      }

    };

    fetchStats();

  }, []);

  /* ================= STATUS DATA ================= */

  const orderStatusData = [
    { name: "Pending", value: orders.filter(o => o.orderStatus === "Pending").length },
    { name: "Processing", value: orders.filter(o => o.orderStatus === "Processing").length },
    { name: "Shipped", value: orders.filter(o => o.orderStatus === "Shipped").length },
    { name: "Delivered", value: orders.filter(o => o.orderStatus === "Delivered").length }
  ];

  const COLORS = ["#facc15", "#3b82f6", "#8b5cf6", "#22c55e"];

  const salesData = orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    sales: order.totalAmount
  }));

  return (

    <AdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          <StatCard title="Users" value={stats.users} />

          <StatCard title="Products" value={stats.products} />

          <StatCard title="Orders" value={stats.orders} />

          <StatCard
            title="Revenue"
            value={formatCurrency(stats.revenue)}
          />

          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.avgOrder)}
          />

        </div>

        {/* ================= CHARTS ================= */}

        <div className="grid grid-cols-2 gap-8 mb-10">

          <ChartCard title="Sales Overview">

            <LineChart data={salesData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
              />

            </LineChart>

          </ChartCard>

          <ChartCard title="Orders by Status">

            <PieChart>

              <Pie
                data={orderStatusData}
                dataKey="value"
                outerRadius={100}
              >

                {orderStatusData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ChartCard>

        </div>

        {/* ================= MONTHLY REVENUE ================= */}

        <ChartCard title="Monthly Revenue">

          <BarChart data={monthlyRevenue}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="revenue"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ChartCard>

        {/* ================= TOP PRODUCTS ================= */}

        <ChartCard title="Top Selling Products">

          <BarChart data={topProducts}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="sold"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ChartCard>

        {/* ================= LOW STOCK ================= */}

        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="font-semibold mb-4 text-red-500">
            Low Stock Products
          </h2>

          {lowStock.length === 0 ? (

            <p>No low stock products</p>

          ) : (

            <div className="space-y-2">

              {lowStock.map(p => (

                <div
                  key={p._id}
                  className="flex justify-between border-b pb-2"
                >

                  <span>{p.name}</span>

                  <span className="text-red-500 font-semibold">
                    {p.countInStock} left
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4 text-center">
            Recent Orders
          </h2>

          <table className="w-full table-auto">

            <thead>

              <tr className="border-b text-gray-700">

                <th className="py-3 px-4 text-left">
                  Order
                </th>

                <th className="py-3 px-4 text-center">
                  Status
                </th>

                <th className="py-3 px-4 text-right">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {orders.map(o => (

                <tr
                  key={o._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4 text-left font-medium">

                    ORD-{o._id.slice(-6).toUpperCase()}

                  </td>

                  <td className="py-3 px-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        o.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.orderStatus}
                    </span>

                  </td>

                  <td className="py-3 px-4 text-right font-semibold">

                    {formatCurrency(o.totalAmount)}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>

  );

}

/* ================= UI COMPONENTS ================= */

function StatCard({ title, value }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>

    </div>

  );

}

function ChartCard({ title, children }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow mb-10">

      <h2 className="font-semibold mb-4">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>

    </div>

  );

}