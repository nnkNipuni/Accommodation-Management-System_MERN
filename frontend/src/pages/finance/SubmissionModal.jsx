import React from 'react';

const SubmissionModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold">Submission Status</h2>
        <p>{message}</p>
        <button onClick={onClose} className="mt-4 bg-black text-white p-2 rounded hover:bg-gray-900">Close</button>
      </div>
    </div>
  );
};

export default SubmissionModal;