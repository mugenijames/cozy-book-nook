import { useEffect, useState } from "react";

const LogoSplash = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    // Remove splash after fade animation
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "rgba(255, 255, 255, 0.85)", 
        backdropFilter: "blur(6px)",
      }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        className={`w-32 md:w-48 transition-transform duration-[2000ms] ease-out ${
          fadeOut ? "scale-125" : "scale-75"
        }`}
      />
    </div>
  );
};

export default LogoSplash;