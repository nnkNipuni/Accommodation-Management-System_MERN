// Sidebar.jsx
import React from 'react';
import { HomeIcon, BookOpenIcon, UserIcon } from '@heroicons/react/outline';

const Sidebar = () => {
    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white h-screen">
            <div className="flex items-center p-4">
                <div className="text-xl font-bold">LOGO</div>
            </div>
            <nav className="flex flex-col mt-4">
                <a href="#" className="flex items-center p-2 mb-2 hover:bg-gray-700">
                    <HomeIcon className="h-6 w-6" /> My Boardings
                </a>
                <a href="#" className="flex items-center p-2 mb-2 hover:bg-gray-700">
                    <BookOpenIcon className="h-6 w-6" /> Add New Boarding
                </a>
                <a href="#" className="flex items-center p-2 mb-2 hover:bg-gray-700">
                    <UserIcon className="h-6 w-6" /> Pending Approvals
                </a>
            </nav>
            <div className="mt-auto p-4 cursor-pointer hover:bg-gray-700">
                Logout
            </div>
        </div>
    );
};

export default Sidebar;