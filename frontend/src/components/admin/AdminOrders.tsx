import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/api";

export default function AdminOrders() {
  const { data: orders, isLoading, error } = useQuery(["orders"], () => getOrders());

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Order ID</th>
            <th className="border px-2 py-1">User</th>
            <th className="border px-2 py-1">Books</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: any) => (
            <tr key={order.id}>
              <td className="border px-2 py-1">{order.id}</td>
              <td className="border px-2 py-1">{order.user.name}</td>
              <td className="border px-2 py-1">
                {order.books.map((b: any) => b.title).join(", ")}
              </td>
              <td className="border px-2 py-1">{order.total}</td>
              <td className="border px-2 py-1">{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
