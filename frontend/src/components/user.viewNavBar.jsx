import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const UserviewNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white fixed w-full top-0 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            AccommodationFinder
          </Link>
          <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/searchadd" className="hover:text-blue-500 transition">
                Search Accommodations
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-blue-500 transition">
                Favorites
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-500 transition">
                Contact
              </Link>
            </li>
          </ul>
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="border border-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
              Register
            </Link>
          </div>
        </div>
      </div>
      {isOpen && (
        <ul className="md:hidden bg-gray-800 text-white flex flex-col space-y-4 py-4 px-6 absolute top-16 left-0 w-full shadow-md">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/searchadd" onClick={() => setIsOpen(false)}>Search Accommodations</Link>
          </li>
          <li>
            <Link to="/favorites" onClick={() => setIsOpen(false)}>Favorites</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          <li>
            <Link to="/login" className="border border-white px-4 py-2 rounded text-center" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="bg-blue-600 px-4 py-2 rounded text-center" onClick={() => setIsOpen(false)}>
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default UserviewNavBar;
