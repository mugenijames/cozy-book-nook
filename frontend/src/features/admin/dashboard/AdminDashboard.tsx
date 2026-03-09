export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Welcome to Admin Dashboard</h1>
      <p className="text-xl text-muted-foreground">
        You are successfully logged in as admin.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Total Books</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
      </div>
    </div>
  );
}