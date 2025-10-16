import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminDashboard from "../AdminDashboard/admindash";


function Updatedest() {
  const [inputs, setInputs] = useState({
    destinationName: "",
    country: "",
    description: "",
    category: "",
    image: ""
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchhandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/destinations/${id}`);
        console.log("API response:", res.data);

        const obj = res.data.destination || res.data.destA || res.data;
        setInputs(obj);
      } catch (err) {
        console.error("GET failed:", err);
      }
    };
    fetchhandler();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/destinations/${id}`, inputs);
      navigate('/destinationview');
    } catch (err) {
      console.error("PUT failed:", err);
    }
  };

  return (

     <div className="flex flex-col min-h-screen">
          <AdminDashboard>
        
            <main className="flex-grow">

    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-sky-600 mb-6">Update Destination</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Destination Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
          <input
            type="text"
            name="destinationName"
            value={inputs.destinationName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Province Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select
            name="country"
            value={inputs.country}
            onChange={handleChange}
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
            value={inputs.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={inputs.category}
            onChange={handleChange}
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
            value={inputs.image}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
        >
          Update
        </button>
      </form>
    </div>
     </main>
        </AdminDashboard>
        </div>  
  );
}

export default Updatedest;
