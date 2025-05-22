import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const OwnerPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ date: '', adId: '', status: '' });
  const tableRef = useRef();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchFilters.date) params.append('date', new Date(searchFilters.date).toISOString().split('T')[0]);
        if (searchFilters.adId) params.append('adId', searchFilters.adId);
        if (searchFilters.status) params.append('status', searchFilters.status);

        const response = await axios.get(`http://localhost:5001/api/payments/search?${params.toString()}`);
        setPayments(response.data.payments || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPayments, 300);
    return () => clearTimeout(timer);
  }, [searchFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date' && value && new Date(value) > new Date()) {
      alert('Please select today or a date before today');
      return;
    }
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/payments/status/${paymentId}`, { status: newStatus });
      setPayments(payments.map(payment =>
        payment._id === paymentId ? { ...payment, status: newStatus } : payment
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        // Changed from port 5005 to port 5001 to match your other API calls
        await axios.delete(`http://localhost:5001/api/payments/delete/${paymentId}`);
        setPayments(payments.filter(p => p._id !== paymentId));
        alert('Payment deleted successfully');
      } catch (error) {
        console.error('Error deleting payment:', error);
        setError(error.message || 'Failed to delete payment.');
      }
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const now = new Date();
    doc.setFontSize(16);
    doc.text('Owner Payment Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated: ${now.toLocaleString()}`, 10, 30);

    let y = 40;
    doc.text('Date', 10, y);
    doc.text('Payment ID', 60, y);
    doc.text('Amount', 150, y);
    y += 10;

    payments.forEach(p => {
      doc.text(new Date(p.paymentdate).toLocaleDateString(), 10, y);
      doc.text(p._id || '', 60, y);
      doc.text(p.amount ? `${p.amount}` : '', 150, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`payment-report-${now.toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Owner Payment Management</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['date', 'adId', 'status'].map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">{field}</label>
            {field === 'status' ? (
              <select
                name="status"
                value={searchFilters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <input
                type={field === 'date' ? 'date' : 'text'}
                name={field}
                value={searchFilters[field]}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading payments...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table ref={tableRef} className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 border">Ad ID</th>
                <th className="p-3 border">Payment ID</th>
                <th className="p-3 border">Amount (LKR)</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Slip</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No payments found</td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border">
                      {typeof p.adId === 'object' && p.adId !== null
                        ? (p.adId._id || 'ID not available') 
                        : (p.adId || 'Not specified')}
                    </td>
                    <td className="p-3 border">{p._id}</td>
                    <td className="p-3 border">{p.amount}</td>
                    <td className="p-3 border">{new Date(p.paymentdate).toLocaleDateString()}</td>
                    <td className="p-3 border text-blue-600 hover:underline">
                      <a href={p.proof} download>Download</a>
                    </td>
                    <td className="p-3 border">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:ring focus:ring-indigo-200"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
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

      {/* Report Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleGenerateReport}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 shadow-sm"
        >
          Generate PDF Report
        </button>
      </div>
    </div>
  );
};

export default OwnerPaymentManagement;


