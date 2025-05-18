import React from 'react';
import {  ArrowPathIcon, BanknotesIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const AdminSidebar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white shadow-lg z-50">
            <div className="flex items-center p-4 border-b border-gray-700">
                <div className="text-xl font-bold">LOGO</div>
            </div>
            <nav className="flex flex-col mt-4 px-2">
                
                <a href="/allPayments" className="flex items-center p-2 mb-2 rounded hover:bg-gray-700">
                    <BanknotesIcon className="h-6 w-6 mr-2" /> All payments
                </a>
                <a href="/pendingApprovals" className="flex items-center p-2 mb-2 rounded hover:bg-gray-700">
                    <ArrowPathIcon className="h-6 w-6 mr-2" /> Pending Requests
                </a>

                <a href="/reports" className="flex items-center p-2 mb-2 rounded hover:bg-gray-700">
                    <BookOpenIcon className="h-6 w-6 mr-2" /> Reports
                </a>
            </nav>
            <div className="mt-auto p-4 cursor-pointer hover:bg-gray-700">
                Logout
            </div>
        </div>
    );
};

export default AdminSidebar;
