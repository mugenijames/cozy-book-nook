import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-[#2E1208] text-white p-6">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

      <ul className="space-y-4">
        <li>
          <button
            onClick={() => navigate("/admin/books")}
            className="w-full text-left hover:text-yellow-400"
          >
            Books
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/admin/testimonials")}
            className="w-full text-left hover:text-yellow-400"
          >
            Testimonials
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;