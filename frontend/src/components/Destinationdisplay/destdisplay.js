import React, { useEffect, useState } from "react";
import DestA from "../DestinationForm/destA";
import axios from "axios";
import AdminDashboard from "../AdminDashboard/admindash";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

// const URL = "http://:5001/destinations";
const URL = "http://localhost:5001/destinations";

const fetchhandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Destdisplay() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchhandler().then((data) => setDestinations(data.destinations));
  }, []);

  // ===== Analysis Data =====
  const provinceCounts = destinations.reduce((acc, dest) => {
    acc[dest.country] = (acc[dest.country] || 0) + 1;
    return acc;
  }, {});
  const provinceData = Object.entries(provinceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const categoryCounts = destinations.reduce((acc, dest) => {
    acc[dest.category] = (acc[dest.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = ["#0ea5e9", "#6366f1", "#14b8a6", "#f43f5e", "#f59e0b"];

  // ===== Generate PDF Report =====
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Destination Report", 14, 20);

    // Destination table
    const tableColumn = ["Name", "Province", "Category", "Description"];
    const tableRows = destinations.map((dest) => [
      dest.destinationName,
      dest.country,
      dest.category,
      dest.description,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Province summary
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Province Summary", 14, finalY);
    Object.entries(provinceCounts).forEach(([province, count], i) => {
      doc.text(`${province}: ${count} destinations`, 20, finalY + 8 + i * 7);
    });

    // Category summary
    finalY = finalY + 15 + Object.keys(provinceCounts).length * 7;
    doc.text("Category Summary", 14, finalY);
    Object.entries(categoryCounts).forEach(([cat, count], i) => {
      doc.text(`${cat}: ${count} destinations`, 20, finalY + 8 + i * 7);
    });

    // Save file
    doc.save("Destination_Report.pdf");
  };

  return (
     <div className="flex flex-col min-h-screen">
  <AdminDashboard>

    <main className="flex-grow">
    
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Keep trying New adventures with us
      </h1>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations &&
          destinations.map((destA, i) => (
            <div key={i}>
              <DestA destA={destA} />
            </div>
          ))}
      </div>

      {/* ===== Analysis Section ===== */}
      {destinations.length > 0 && (
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Destination Analysis
          </h2>

          {/* Province Bar Chart */}
          <div className="h-80 mb-12">
            <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">
              Destinations by Province
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="h-80">
            <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">
              Destinations by Category
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Report Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 shadow"
            >
              Download Report (PDF)
            </button>
          </div>
        </div>
      )}
,    </main>
</AdminDashboard>
</div>
);
}

export default Destdisplay;
