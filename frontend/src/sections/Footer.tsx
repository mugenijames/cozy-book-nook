const Footer = () => {
  return (
    <footer className="py-12 bg-[#4A1F0E] text-white text-center">
      <p>© {new Date().getFullYear()} David Emuria</p>
      <p className="text-sm mt-2">
        Author • Speaker • Consultant
      </p>
    </footer>
  );
};

export default Footer;