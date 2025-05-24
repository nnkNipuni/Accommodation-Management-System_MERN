import React, { useState } from 'react';
import { 
  UserIcon, 
  XCircleIcon,
  ArrowPathIcon,
  NewspaperIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onToggle, isMobileOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: UserIcon,
      path: "/dashboard",
    },
    {
      name: "My Advertisements",
      icon: NewspaperIcon,
      path: "/myAds",
    },
    {
      name: "Add New",
      icon: PlusIcon,
      path: "/addAds",
    },
    {
      name: "Approvals",
      icon: ArrowPathIcon,
      submenu: [
        { name: "Pending Approvals", path: "/pending" },
        { name: "Rejected Listings", path: "/rejected" },
      ]
    },
   
    {
      name: "Settings",
      icon: Cog6ToothIcon,
      path: "/settings",
    }
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center justify-center p-12 border-b border-gray-700">
        <img 
            src="/logo2.png" 
            alt="Logo"                    
        /> </div>
       
        <button 
          onClick={onToggle}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
     

      {/* Navigation Menu */}
      <nav className="flex flex-col mt-6 px-2 space-y-1">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.name}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubmenu(index)}
                  className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700 ${openSubmenu === index ? 'bg-gray-700' : ''}`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                  {openSubmenu === index ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                
                {openSubmenu === index && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.path}
                        className={`block p-2 rounded-lg hover:bg-gray-700 ${isActive(subItem.path) ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                href={item.path}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive(item.path) ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </a>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;