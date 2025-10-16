import React, { useEffect, useState } from "react";
import DestA from "../DestinationForm/destA";
import axios from "axios";

// ✅ Import Header & Footer
import Header from "../Header/header";
import Footer from "../Fotter/fotter";

const URL = "http://localhost:5001/destinations";

const fetchhandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Destdisplay() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchhandler().then((data) => setDestinations(data.destinations));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Keep trying New adventures with us
        </h1>

        {/* Destination Cards */}
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
            [&_.mt-4.flex.justify-center.gap-3]:hidden
          "
        >
          {destinations && destinations.length > 0 ? (
            destinations.map((destA, i) => (
              <div key={i}>
                <DestA destA={destA} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No destinations available
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Destdisplay;
