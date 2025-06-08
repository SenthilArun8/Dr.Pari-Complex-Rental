import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../utils/axios';
import '../index.css';

const EditVacantShopPage = () => {
 // --- Vacant Shop State Fields ---
 const [shopNumber, setShopNumber] = useState('');
 const [dimensions, setDimensions] = useState('');
 const [loading, setLoading] = useState(true); // Loading state for data fetch
 const [error, setError] = useState(null); // Error state for data fetch

 // --- Context and Navigation ---
 const { user, token } = useUser();
 const navigate = useNavigate();
 const { id } = useParams(); // Get the shop ID from the URL

 // Redirect to login if not logged in
 useEffect(() => {
  if (!user || !token) {
   navigate('/login');
  }
 }, [user, token, navigate]);

 // --- Fetch Vacant Shop Data on Component Mount ---
 useEffect(() => {
  const fetchVacantShop = async () => {
   if (!id || !token) {
    setLoading(false);
    // If no ID or token, we can't fetch, so redirect or show an error.
    if (!id) toast.error('No shop ID provided for editing.');
    navigate('/vacant-shops'); // Redirect to a safe page
    return;
   }
   try {
    const response = await axiosInstance.get(`/vacant-shops/${id}`, {
     headers: { Authorization: `Bearer ${token}` }
    });
    const shopData = response.data.data; // Access data property from your backend response
    setShopNumber(shopData.shopNumber);
    setDimensions(shopData.dimensions);
    setLoading(false);
   } catch (err) {
    console.error('Failed to fetch vacant shop for editing:', err.response?.data || err.message);
    setError('Failed to load shop data. Please try again.');
    toast.error(err.response?.data?.message || 'Failed to load shop data.');
    setLoading(false);
    navigate('/vacant-shops'); // Redirect on error
   }
  };

  fetchVacantShop();
 }, [id, token, navigate]);

 // --- Form Submission Handler (for UPDATE) ---
 const submitForm = async (e) => {
  e.preventDefault();

  if (!token) {
   toast.error('Please log in first.');
   return;
  }

  if (!id) {
   toast.error('Cannot update: Shop ID is missing.');
   return;
  }

  const updatedVacantShop = {
   shopNumber,
   dimensions,
  };

  try {
   const response = await axiosInstance.put(`/vacant-shops/${id}`, updatedVacantShop, {
    headers: { Authorization: `Bearer ${token}` }
   });

   console.log('Vacant Shop Updated:', response.data);
   toast.success('Vacant shop updated successfully!');
   navigate('/vacant-shops'); // Navigate back to vacant shops list
  } catch (error) {
   console.error('Failed to update vacant shop:', error.response?.data || error.message);
   toast.error(error.response?.data?.message || 'Failed to update vacant shop.');
  }
 };

 // --- Loading and Error States ---
 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
    <p className="text-emerald-800 text-lg">Loading shop data...</p>
   </div>
  );
 }

 if (error) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
    <p className="text-red-500 text-lg">{error}</p>
   </div>
  );
 }

 return (
  <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] py-12 relative">
   <div className="w-full max-w-xl p-8 backdrop-blur-md bg-white/70 rounded-xl shadow-lg relative z-20">
    <div className="py-4" />
    <form onSubmit={submitForm}>
     <h2 className="text-3xl text-center font-bold text-emerald-800 mb-8">Edit Vacant Shop</h2>

     <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Shop Details</h3>
     <div className="mb-4 relative">
      <label className="block text-emerald-900 font-bold mb-2">Shop Number</label>
      <input
       type="text"
       className="border border-emerald-300 rounded w-full py-2 px-3"
       placeholder="e.g. B-205"
       value={shopNumber}
       onChange={(e) => setShopNumber(e.target.value)}
       required
      />
     </div>

     <div className="mb-4 relative">
      <label className="block text-emerald-900 font-bold mb-2">Dimensions</label>
      <input
       type="text"
       className="border border-emerald-300 rounded w-full py-2 px-3"
       placeholder="e.g., 4m x 3.5m"
       value={dimensions}
       onChange={(e) => setDimensions(e.target.value)}
       required
      />
     </div>

     {/* Submit Button */}
     <div className="mt-8">
      <button
       type="submit"
       className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
       Update Vacant Shop
      </button>
     </div>
    </form>
   </div>
  </div>
 );
};

export default EditVacantShopPage;