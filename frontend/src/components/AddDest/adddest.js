import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../AdminDashboard/admindash";


function Adddest() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    destinationName: "",
    country: "",
    description: "",
    category: "",
    image: "",
  });

  const handlechange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/destinationview"));
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5001/destinations", {
        destinationName: String(inputs.destinationName),
        country: String(inputs.country), 
        description: String(inputs.description),
        category: String(inputs.category),
        image: String(inputs.image),
      })
      .then((res) => res.data);
  };

  return (

     <div className="flex flex-col min-h-screen">
      <AdminDashboard>
    
        <main className="flex-grow">
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-sky-600 mb-6">Add New Destination</h1>
      <form onSubmit={handlesubmit} className="space-y-4">
        
        {/* Destination Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
          <input
            type="text"
            name="destinationName"
            onChange={handlechange}
            value={inputs.destinationName}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Province Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select
            name="country"
            onChange={handlechange}
            value={inputs.country}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="" disabled>Select a Province</option>
            <option value="Central Province">Central Province</option>
            <option value="Eastern Province">Eastern Province</option>
            <option value="North Central Province">North Central Province</option>
            <option value="Northern Province">Northern Province</option>
            <option value="North Western Province">North Western Province</option>
            <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
            <option value="Southern Province">Southern Province</option>
            <option value="Uva Province">Uva Province</option>
            <option value="Western Province">Western Province</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            onChange={handlechange}
            value={inputs.description}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            onChange={handlechange}
            value={inputs.category}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="" disabled>Select a Category</option>
            <option value="Beach">Beach</option>
            <option value="Historical">Historical</option>
            <option value="Adventure">Adventure</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            onChange={handlechange}
            value={inputs.image}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
    </main>
    </AdminDashboard>
    </div>  

  );
}

export default Adddest;
