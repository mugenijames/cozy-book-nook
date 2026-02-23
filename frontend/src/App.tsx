import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Public Site */}
      <Route path="/" element={<Home />} />
      <Route path="/book/:slug" element={<BookDetail />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
}

export default App;