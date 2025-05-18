import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import logo from '../assets/ss.webp';

const OwnerPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    adId: '',
    status: ''
  });
  const tableRef = useRef();

  // Fetch payment details on component mount and when filters change
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        // Format date to YYYY-MM-DD if it exists
        if (searchFilters.date) {
          const formattedDate = new Date(searchFilters.date).toISOString().split('T')[0];
          params.append('date', formattedDate);
        }
        
        if (searchFilters.adId) {
          params.append('adId', searchFilters.adId);
        }
        
        if (searchFilters.status) {
          params.append('status', searchFilters.status);
        }

        const response = await axios.get(`http://localhost:5001/api/payments/search?${params.toString()}`);
        setPayments(response.data.payments || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Add a small delay to prevent too many API calls
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (selected > now) {
        alert('Please select today or a date before today');
        return;
      }
    }
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle status update
  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5005/api/payments/status/${paymentId}`, { status: newStatus });
      setPayments(payments.map(payment =>
        payment._id === paymentId ? { ...payment, status: newStatus } : payment
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5005/api/payments/delete/${paymentId}`);
      setPayments(payments.filter(payment => payment._id !== paymentId));
      alert('Payment deleted successfully');
    } catch (error) {
      console.error('Error deleting payment:', error);
      setError(error.message || 'Failed to delete payment.');
    }
  };

  const handleGenerateReport = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    // Add logo
    const img = new window.Image();
    // img.src = logo;
    img.onload = async () => {
      doc.addImage(img, 'WEBP', 10, 10, 30, 30);
      // Add generated date/time
      const now = new Date();
      doc.setFontSize(12);
      doc.text(`Generated: ${now.toLocaleString()}`, 150, 20, { align: 'right' });
      // Add title
      doc.setFontSize(16);
      doc.text('Owner Payment Report', 105, 50, { align: 'center' });
      // Table headers
      doc.setFontSize(12);
      let y = 65;
      doc.text('Payment Date', 20, y);
      doc.text('Payment ID', 70, y);
      doc.text('Payment Amount', 140, y);
      y += 8;
      payments.forEach(payment => {
        doc.text(new Date(payment.paymentdate).toLocaleDateString(), 20, y);
        doc.text(payment._id ? String(payment._id) : '', 70, y);
        doc.text(payment.amount ? String(payment.amount) : '', 140, y);
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save(`owner-payment-report-${now.toISOString().slice(0,10)}.pdf`);
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Owner Payment Management</h2>
      
      {/* Search Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={searchFilters.date}
            onChange={handleFilterChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad ID</label>
          <input
            type="text"
            name="adId"
            value={searchFilters.adId}
            onChange={handleFilterChange}
            placeholder="Enter Ad ID"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={searchFilters.status}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading payments...</div>}
      {error && <div className="text-red-500 text-center py-4">Error: {error}</div>}

      {/* Payments Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table ref={tableRef} className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Ad ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Payment ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Payment Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Payment Slip</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No payments found</td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{payment.advertisementId}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(payment.paymentdate).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a href={payment.proof} download className="text-blue-500 hover:underline">
                        Download
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={payment.status}
                        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleGenerateReport}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default OwnerPaymentManagement;