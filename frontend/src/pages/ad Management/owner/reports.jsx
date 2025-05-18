import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; //Libraries used to create and format the PDF report.
import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";

const Reports = () => {
  const [ads, setAds] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const generateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/advertisements/report/monthly");
      setAds(response.data.ads);
      setShowReport(true);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Monthly Advertisement Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Type", "Location", "Price"]],
      body: ads.map(ad => [ad.title, ad.AccommodationType, ad.location, `Rs. ${ad.price}`]),
    });
    doc.save("Monthly_Advertisement_Report.pdf");
  };

  return (
    <>
     <AdminOwnerNavbar role="admin" />
    <div className="p-10 pt-20">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {!showReport && (
        <div
          onClick={generateReport}
          className="cursor-pointer p-6 border rounded-lg bg-gray-100 hover:bg-gray-200 shadow-md transition"
        >
          <h2 className="text-xl font-medium">📊 Generate Monthly Advertisement Report</h2>
        </div>
      )}

      {showReport && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Advertisement Report</h2>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad._id}>
                  <td className="border px-4 py-2">{ad.title}</td>
                  <td className="border px-4 py-2">{ad.AccommodationType}</td>
                  <td className="border px-4 py-2">{ad.location}</td>
                  <td className="border px-4 py-2">Rs. {ad.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadPDF}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default Reports;
