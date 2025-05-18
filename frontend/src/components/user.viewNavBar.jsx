import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Home, Heart, Contact, User, Key} from "lucide-react";

const UserviewNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-bold flex items-center">
            
            <img
        src={`${process.env.PUBLIC_URL}/logo.png`}  // Correct path
        alt="Logo"
        className="h-20 w-auto max-w-[220px]"  // Adjust size as needed
      />
          </Link>
          <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X size={28} className="text-gray-700" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </div>
          <ul className="hidden md:flex space-x-8 items-center">
            <li>
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                <Home className="mr-1" size={18} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/searchadd"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                <Search className="mr-1" size={18} />
                Find Boarding
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                <Heart className="mr-1" size={18} />
                Favorites
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                <Contact className="mr-1" size={18} />
                Contact
              </Link>
            </li>
          </ul>
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              to="/login"
              className="flex items-center border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              <Key className="mr-2" size={18} />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <User className="mr-2" size={18} />
              Register
            </Link>
          </div>
        </div>
      </div>
      {isOpen && (
        <ul className="md:hidden bg-white text-gray-700 flex flex-col space-y-4 py-4 px-6 absolute top-20 left-0 w-full shadow-lg border-b border-gray-200">
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center py-2 px-2 hover:bg-indigo-50 rounded-lg"
            >
              <Home className="mr-3" size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/searchadd"
              onClick={() => setIsOpen(false)}
              className="flex items-center py-2 px-2 hover:bg-indigo-50 rounded-lg"
            >
              <Search className="mr-3" size={18} />
              Find Boarding
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center py-2 px-2 hover:bg-indigo-50 rounded-lg"
            >
              <Heart className="mr-3" size={18} />
              Favorites
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center py-2 px-2 hover:bg-indigo-50 rounded-lg"
            >
              <Contact className="mr-3" size={18} />
              Contact
            </Link>
          </li>
          <li className="mt-4">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              <Key className="mr-2" size={18} />
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
            >
              <User className="mr-2" size={18} />
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default UserviewNavBar;
