import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-base-100 border-t border-base-300 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-base-content/70">
        <span className="font-semibold">Messenger Chat App</span> &copy;{" "}
        {currentYear}
      </div>
    </footer>
  );
};

export default Footer;
