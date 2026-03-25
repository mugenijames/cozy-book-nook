import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2E1208] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="David Emuria" className="h-12 w-12 rounded-full border-2 border-[#D4A017]" />
              <div>
                <h3 className="font-heading text-xl font-bold">David Emuria</h3>
                <p className="text-sm text-gray-300">Author & Speaker</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforming lives through powerful stories, practical wisdom, and meaningful connections.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/davidemuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-[#D4A017] hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com/davidemuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-[#D4A017] hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com/davidemuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-[#D4A017] hover:text-white transition-colors" />
              </a>
              <a
                href="https://youtube.com/@davidemuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-[#D4A017] hover:text-white transition-colors" />
              </a>
              <a
                href="https://linkedin.com/in/davidemuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-[#D4A017] hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-[#D4A017]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="/#books" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Books
                </a>
              </li>
              <li>
                <Link to="/books" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <a href="/#program" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Programs
                </a>
              </li>
              <li>
                <a href="/#speaking" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Speaking
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-[#D4A017]">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/programs/school-ministry" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  School Ministry
                </Link>
              </li>
              <li>
                <Link to="/programs/church-outreaches" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Church Outreaches
                </Link>
              </li>
              <li>
                <Link to="/programs/leadership-training" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Leadership Training
                </Link>
              </li>
              <li>
                <Link to="/programs/philanthropy" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  Philanthropy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-[#D4A017]">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#D4A017] mt-0.5" />
                <a href="mailto:david@davidemuria.com" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  david@davidemuria.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#D4A017] mt-0.5" />
                <a href="tel:+254700000000" className="text-gray-300 hover:text-[#D4A017] transition-colors text-sm">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#D4A017] mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright on Left, Bridgelink on Right */}
        <div className="border-t border-[#D4A017]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright - Left Side */}
          <p className="text-gray-400 text-sm order-2 md:order-1">
            &copy; {new Date().getFullYear()} David Emuria. All rights reserved.
          </p>
          
          {/* Back to Top Button - Center on Mobile, Right on Desktop */}
          <button
            onClick={scrollToTop}
            className="bg-[#D4A017]/20 hover:bg-[#D4A017] p-2 rounded-full transition-all duration-300 group order-1 md:order-2"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5 text-[#D4A017] group-hover:text-white transition-colors" />
          </button>
          
          {/* Bridgelink Digital - Right Side */}
          <div className="order-3">
            <p className="text-gray-500 text-xs">
              Powered by{' '}
              <a 
                href="https://bridgelink.co.ke" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D4A017] hover:text-[#b58900] transition-colors font-medium"
              >
                Bridgelink Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;