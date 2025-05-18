// import React from 'react';

// const PriceInput = ({ price, setPrice }) => {
//     const handleIncrement = (amount) => {
//         setPrice((prevPrice) => parseFloat((prevPrice + amount).toFixed(2)));
//     };

//     const handleChange = (e) => {
//         const value = e.target.value;
//         // Validate the input to ensure it's a valid number with up to two decimal places
//         if (/^\d*\.?\d{0,2}$/.test(value)) {
//             setPrice(value === '' ? 0.00 : parseFloat(value));
//         }
//     };

//     return (
//         <div className="space-y-2">
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                 Price (LKR)
//             </label>
//             <div className="flex">
//                 <button
//                     type="button"
//                     onClick={() => handleIncrement(-100)}
//                     className="bg-gray-300 text-gray-700 p-2 rounded-l"
//                 >
//                     -100
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => handleIncrement(-1000)}
//                     className="bg-gray-300 text-gray-700 p-2"
//                 >
//                     -1000
//                 </button>
//                 <input
//                     type="text"
//                     id="price"
//                     name="price"
//                     value={price.toFixed(2)}
//                     onChange={handleChange}
//                     className="border p-2 w-full text-center"
//                     required
//                 />
//                 <button
//                     type="button"
//                     onClick={() => handleIncrement(100)}
//                     className="bg-gray-300 text-gray-700 p-2"
//                 >
//                     +100
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => handleIncrement(1000)}
//                     className="bg-gray-300 text-gray-700 p-2 rounded-r"
//                 >
//                     +1000
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PriceInput;
