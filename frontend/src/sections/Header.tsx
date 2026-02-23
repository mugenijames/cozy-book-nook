import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* Brand Name Only */}
        <Link to="/" className="text-xl font-bold text-[#4A1F0E]">
          David Emuria
        </Link>

        {/* Navigation */}
        <nav className="flex gap-8 font-medium text-[#4A1F0E]">
          <a href="#about" className="hover:text-[#8B4513] transition">About</a>
          <a href="#books" className="hover:text-[#8B4513] transition">Books</a>
          <a href="#program" className="hover:text-[#8B4513] transition">Programs</a>
          <a href="#speaking" className="hover:text-[#8B4513] transition">Speaking</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;