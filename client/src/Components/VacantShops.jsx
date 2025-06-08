// src/Components/VacantShops.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Shop from './Shop'; // Assuming Shop.jsx is in the same 'Components' folder
import BlurredBackground from './BlurredBackground'; // Assuming BlurredBackground.jsx is in 'Components'
import Spinner from './Spinner'; // Assuming Spinner.jsx is in 'Components'

const VacantShops = ({ isHome = false }) => {
  const [vacantShops, setVacantShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useUser(); // Need user and token for admin checks and auth header

  // Function to handle shop deletion and update the state
  const handleShopDeleted = (deletedShopId) => {
    setVacantShops(prevShops => prevShops.filter(shop => shop._id !== deletedShopId));
  };

  useEffect(() => {
    const fetchVacantShops = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = {};
        // Only include Authorization header if a token is available
        if (token) {
          config.headers = {
            Authorization: `Bearer ${token}`,
          };
        }

        // Adjust API URL based on isHome prop
        const apiUrl = isHome
          ? '/vacant-shops?_limit=3' // Example: fetch only 3 shops for home
          : '/vacant-shops';

        const response = await axiosInstance.get(apiUrl, config);

        let fetchedData = response.data;
        if (fetchedData && typeof fetchedData === 'object' && 'data' in fetchedData && Array.isArray(fetchedData.data)) {
          fetchedData = fetchedData.data;
        } else if (Array.isArray(fetchedData)) {
          // Fallback if the backend directly returns an array
          fetchedData = fetchedData;
        } else {
          console.warn("Fetched vacant shop data is not an array in 'data' property or directly:", fetchedData);
          fetchedData = [];
          setError('Invalid data format received from server for vacant shops.');
        }

        setVacantShops(fetchedData);

      } catch (err) {
        console.error('Error fetching vacant shops:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load vacant shops. Please try again.');
        if (err.response && err.response.status === 401) {
          setError("Authentication required to view available shops. Please log in.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVacantShops();
  }, [token, isHome]); // Re-run effect if token or isHome changes

  // Don't render anything if it's for home and no token (assuming home only shows for authenticated users)
  // Or, if home page is public, you might remove this to show public shops
  if (isHome && !token) {
     return null; // Or show a public version of recent shops if your API supports it
  }

  // --- Render Logic for Loading/Error States ---
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center relative bg-white isolate px-6 py-12 lg:px-8">
        <BlurredBackground />
        <div className="text-center text-xl text-emerald-700 py-8 backdrop-blur-md bg-[#FFEDD2]/80 rounded-xl shadow-lg p-8">
          <Spinner loading={loading} />
          Loading vacant shops...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center relative bg-white isolate px-6 py-12 lg:px-8">
        <BlurredBackground />
        <div className="text-center text-xl text-red-600 py-8 backdrop-blur-md bg-[#FFEDD2]/80 rounded-xl shadow-lg p-8">
          Error: {error}
          {error.includes("log in") && (
            <p className="mt-4 text-gray-700">Please <Link to="/login" className="text-emerald-600 hover:underline">log in</Link> to view content.</p>
          )}
        </div>
      </section>
    );
  }

  // --- Main Content Rendering ---
  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white isolate px-6 py-12 lg:px-8">
      <BlurredBackground />
      <div className="w-full max-w-6xl p-8 backdrop-blur-md bg-[#FFEDD2]/80 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#162114] text-center w-full">
            {isHome ? 'Recent Vacant Shops' : 'All Vacant Shops'}
          </h2>
          {user && user.role === 'admin' && (
            <Link to="/add-vacant-shop" className="ml-4 px-6 py-2 bg-emerald-700 text-white rounded-lg shadow-md hover:bg-emerald-800 transition-colors duration-300 flex-shrink-0">
              Add New Shop
            </Link>
          )}
        </div>

        {vacantShops.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-8">
            No vacant shops currently available.
            <br />
            {user && user.role === 'admin' && (
              <Link to="/add-vacant-shop" className="text-emerald-600 hover:underline mt-4 inline-block">
                Click here to add a new shop!
              </Link>
            )}
            {(!user || user.role !== 'admin') && (
              <p className="mt-4 text-gray-700">Check back later for new listings!</p>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {vacantShops.map((shop) => (
              <Shop key={shop._id} shop={shop} user={user} onDelete={handleShopDeleted} />
            ))}

            {/* Add New Shop Card (for admins) */}
            {user && user.role === 'admin' && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 bg-white/40 rounded-xl min-h-[220px] h-full cursor-pointer hover:bg-emerald-50 transition group">
                <Link to="/add-vacant-shop" className="flex flex-col items-center justify-center w-full h-full py-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-emerald-400 bg-white/70 group-hover:bg-emerald-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#059669" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="mt-4 text-emerald-700 font-semibold text-lg opacity-80">Add Shop</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default VacantShops;