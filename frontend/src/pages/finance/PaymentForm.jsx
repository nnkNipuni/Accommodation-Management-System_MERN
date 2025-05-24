import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SubmissionModal from './SubmissionModal';
import axios from 'axios';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function PaymentForm() {
  const { adId } = useParams();
  const [formData, setFormData] = useState({
    amount: '',
    paymentdate: '',
    proof: null,
  });

  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const testUserId = '65f1a2b3c4d5e6f7a8b9c0d1';

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (adId) {
        try {
          const response = await axios.get(`http://localhost:5001/api/advertisements/${adId}`);
          setAdDetails(response.data);
          setFormData(prev => ({
            ...prev,
            amount: response.data.price ? response.data.price.toString() : ''
          }));
        } catch (error) {
          console.error("Error fetching ad details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdDetails();
  }, [adId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData({ ...formData, proof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.paymentdate) {
      newErrors.paymentdate = 'Please select a payment date';
    } else {
      const selectedDate = new Date(formData.paymentdate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.paymentdate = 'Please select today or a past date';
      }
    }
    if (!formData.proof) {
      newErrors.proof = 'Please upload a payment proof';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formDataToSend = new FormData();
    formDataToSend.append('adId', adId);
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('paymentdate', formData.paymentdate);
    formDataToSend.append('proof', formData.proof);
    formDataToSend.append('userId', testUserId);

    try {
      await fetch("http://localhost:5001/api/payments/create", {
        method: 'POST',
        body: formDataToSend,
      });

      setSubmitted(true);
      setFormData({ amount: '', paymentdate: '', proof: null });
      setErrors({});
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading ad details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white shadow-md rounded-lg p-6 border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit Your Payment</h2>

      {submitted && (
        <div className="flex items-center bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded mb-6">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Payment submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (LKR)</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onInput={e => e.target.value = e.target.value.replace(/[^0-9.]/g, '')}
            className={`w-full px-4 py-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
          <input
            type="date"
            name="paymentdate"
            value={formData.paymentdate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border ${errors.paymentdate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.paymentdate && <p className="text-sm text-red-600 mt-1">{errors.paymentdate}</p>}
        </div>

        {/* Proof */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Proof (PDF)</label>
          <input
            type="file"
            name="proof"
            accept=".pdf"
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.proof ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.proof && <p className="text-sm text-red-600 mt-1">{errors.proof}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
