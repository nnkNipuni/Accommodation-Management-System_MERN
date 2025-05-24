
import React from 'react';
import { ArrowPathIcon, BanknotesIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    // Helper function to check if path is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-center p-12 border-b border-gray-700">
                <img 
                    src="/logo2.png" 
                    alt="Logo" 
                    
                />
            </div>
            <nav className="flex flex-col mt-6 px-4 space-y-2">
                <a 
                    href="/allPayments" 
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 ${
                        isActive('/allPayments') ? 'bg-indigo-600' : ''
                    }`}
                >
                    <BanknotesIcon className="h-5 w-5 mr-3" /> 
                    <span className="text-sm font-medium">All payments</span>
                </a>
                <a 
                    href="/pendingApprovals" 
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 ${
                        isActive('/pendingApprovals') ? 'bg-indigo-600' : ''
                    }`}
                >
                    <ArrowPathIcon className="h-5 w-5 mr-3" /> 
                    <span className="text-sm font-medium">Pending Requests</span>
                </a>
                <a 
                    href="/reports" 
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 ${
                        isActive('/reports') ? 'bg-indigo-600' : ''
                    }`}
                >
                    <BookOpenIcon className="h-5 w-5 mr-3" /> 
                    <span className="text-sm font-medium">Reports</span>
                </a>
            </nav>
            <div className="mt-auto p-4">
                <button className="w-full py-2 px-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;