import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";

const AdminOwnerNavbar = ({ role = "owner", profileImage, onMenuToggle }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  const title = role === "admin" ? "Admin Dashboard" : "Owner Dashboard";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: "New booking request", time: "10 mins ago", read: false },
      { id: 2, message: "Payment received", time: "2 hours ago", read: true },
      { id: 3, message: "Maintenance scheduled", time: "1 day ago", read: true },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm z-40">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuToggle}
        className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
      >
        <IoMdMenu size={24} />
      </button>

      {/* Center Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center ml-auto space-x-4">
        <div className="hidden md:block text-sm font-medium text-gray-600">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="text-gray-600 hover:text-gray-900 relative">
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Settings */}
        <button 
          onClick={() => navigate("/settings")}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaCog size={18} />
        </button>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <FaUserCircle className="text-2xl text-gray-600" />
            )}
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {role === "admin" ? "Admin" : "Owner"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerNavbar;
