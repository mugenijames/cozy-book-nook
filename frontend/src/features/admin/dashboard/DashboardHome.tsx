// src/features/admin/dashboard/DashboardHome.tsx
export default function DashboardHome() {
  console.log("DashboardHome rendering");
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Books</h3>
          <p className="text-2xl font-bold">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">5,678</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-2xl font-bold">$98,765</p>
        </div>
      </div>
    </div>
  );
}