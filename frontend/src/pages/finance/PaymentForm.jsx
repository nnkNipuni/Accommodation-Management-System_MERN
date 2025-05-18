import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubmissionModal from './SubmissionModal';
import { useParams } from 'react-router-dom';

function PaymentForm() {
  const { adId } = useParams();
  const [formData, setFormData] = useState({
    amount: '',
    paymentdate: '',
    proof: null,
  });
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // For testing purposes, use a valid MongoDB ObjectId
  // This should be replaced with actual user authentication
  const testUserId = '65f1a2b3c4d5e6f7a8b9c0d1';

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
      const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (selected > now) {
        newErrors.paymentdate = 'Please select today or a date before today';
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('adId', adId);
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('paymentdate', formData.paymentdate);
    formDataToSend.append('proof', formData.proof);
    formDataToSend.append('userId', testUserId);

    try {
      const response = await fetch("http://localhost:5001/api/payments/create", {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage('Payment submitted successfully!');
        setFormData({ amount: '', paymentdate: '', proof: null });
        setErrors({});
      } else {
        setModalMessage(data.message || 'Failed to submit payment. Please try again.');
        if (data.error) {
          console.error('Server error:', data.error);
        }
      }
      setModalOpen(true);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setModalMessage('An error occurred. Please try again.');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalMessage.includes('successfully')) {
      navigate('/transactions');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button className="mr-2 text-gray-600">←</button>
          <h2 className="text-xl font-semibold">Payments</h2>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onInput={e => e.target.value = e.target.value.replace(/[^0-9.]/g, '')}
            className={`mt-1 block w-full p-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">Please enter a valid number greater than 0</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <input
            type="date"
            name="paymentdate"
            value={formData.paymentdate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`mt-1 block w-full p-2 border ${errors.paymentdate ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.paymentdate && <p className="text-red-500 text-sm mt-1">{errors.paymentdate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Proof</label>
          <input
            type="file"
            name="proof"
            accept='.pdf'
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border ${errors.proof ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.proof && <p className="text-red-500 text-sm mt-1">{errors.proof}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Submit Payment
        </button>
      </form>

      <SubmissionModal
        isOpen={modalOpen}
        onClose={closeModal}
        message={modalMessage}
      />
    </div>
  );
}

export default PaymentForm;