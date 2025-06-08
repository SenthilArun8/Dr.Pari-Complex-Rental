import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../utils/axios';
import '../index.css'; // Assuming you have a global CSS file

const AddVacantShopPage = () => {
  // --- Vacant Shop State Fields ---
  const [shopNumber, setShopNumber] = useState('');
  const [dimensions, setDimensions] = useState('');

  // --- Context and Navigation ---
  const { user, token } = useUser();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  // --- Form Submission Handler ---
  const submitForm = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please log in first.');
      return;
    }

    const newVacantShop = {
      shopNumber,
      dimensions,
      // No need to manually add `user` field here, as your backend's `protect` middleware
      // should attach `req.user._id` before saving to the database for the authenticated user.
    };

    try {
      // Call your backend API to add a new vacant shop
      // Assuming your backend has an endpoint like '/vacant-shops' for POST requests
      const response = await axiosInstance.post('/vacant-shops', newVacantShop);

      console.log('New Vacant Shop Added:', response.data);
      toast.success('Vacant shop added successfully!');
      // Navigate to a page showing all vacant shops or a confirmation
      navigate('/vacant-shops');
    } catch (error) {
      console.error('Failed to add vacant shop:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add vacant shop.');
    }
  };

  // --- Tutorial Steps (Simplified for Vacant Shop context) ---
  const tutorialSteps = [
    { key: 'shopNumber', label: 'Shop Number', description: 'Enter the unique number for this vacant shop unit (e.g., "B-205").' },
    { key: 'dimensions', label: 'Dimensions', description: 'Enter the dimensions of the vacant shop (e.g., "10ft x 15ft" or "150 sq ft").' },
  ];

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [dontShowTutorial, setDontShowTutorial] = useState(
    localStorage.getItem('hideAddVacantShopTutorial') === 'true' // Changed local storage key
  );

  useEffect(() => {
    if (dontShowTutorial) setShowTutorial(false);
  }, [dontShowTutorial]);

  const isSpotlight = (stepKey) => {
    if (!showTutorial) return false;
    const isCurrentStep = tutorialSteps[tutorialStep].key === stepKey;
    return isCurrentStep;
  };

  const stepKeyToIndex = Object.fromEntries(tutorialSteps.map((step, idx) => [step.key, idx]));

  const handleSpotlightFocus = (stepKey) => {
    if (showTutorial && tutorialStep !== stepKeyToIndex[stepKey]) {
      setTutorialStep(stepKeyToIndex[stepKey]);
    }
  };

  const handleDontShowTutorial = () => {
    setDontShowTutorial(true);
    setShowTutorial(false);
    localStorage.setItem('hideAddVacantShopTutorial', 'true'); // Changed local storage key
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TutorialTooltip = ({ step }) => (
    <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg px-6 py-4 border-2 border-emerald-700 max-w-md text-center z-50">
      <div className="font-bold text-emerald-800 mb-2">{tutorialSteps[step].label}</div>
      <div className="text-emerald-900 mb-4">{tutorialSteps[step].description}</div>
      <div className="flex justify-between">
        <button
          className="px-3 py-1 rounded bg-emerald-200 text-emerald-900 font-semibold disabled:opacity-50"
          onClick={() => setTutorialStep((s) => Math.max(0, s - 1))}
          disabled={tutorialStep === 0}
        >Previous</button>
        {tutorialStep < tutorialSteps.length - 1 ? (
          <button
            className="px-3 py-1 rounded bg-emerald-700 text-white font-semibold"
            onClick={() => setTutorialStep((s) => s + 1)}
          >Next</button>
        ) : (
          <button
            className="px-3 py-1 rounded bg-emerald-700 text-white font-semibold"
            onClick={() => setShowTutorial(false)}
          >Finish</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] py-12 relative">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-0 z-30 pointer-events-none" />
      )}
      <div className="w-full max-w-xl p-8 backdrop-blur-md bg-white/70 rounded-xl shadow-lg relative z-20">
        {/* Top padding before form */}
        <div className="py-4" />
        <form onSubmit={submitForm}>
          <h2 className="text-3xl text-center font-bold text-emerald-800 mb-8">Add New Vacant Shop</h2>

          {/* Vacant Shop Details */}
          <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Shop Details</h3>
          <div className={`mb-4 relative ${isSpotlight('shopNumber') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('shopNumber') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Shop Number</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. B-205"
              value={shopNumber}
              onChange={(e) => setShopNumber(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('shopNumber')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('dimensions') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('dimensions') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Dimensions</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g., 4m x 3.5m
"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('dimensions')}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Vacant Shop
            </button>
          </div>
        </form>
      </div>

      {/* Tutorial Controls - MOVED TO BOTTOM-LEFT */}
      {showTutorial && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 bg-white/90 p-3 rounded-lg shadow-md">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowTutorial}
            onChange={handleDontShowTutorial}
            className="form-checkbox h-4 w-4 text-emerald-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="dontShowAgain" className="text-sm text-gray-700">Don't show tutorial again</label>
          <button
            onClick={() => setShowTutorial(false)}
            className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Hide Tutorial
          </button>
        </div>
      )}

      {/* Scroll to Top Button (remains at bottom-right) */}
      {/* {showTutorial && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-4 right-4 bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 z-40"
          title="Scroll to Top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )} */}
    </div>
  );
};

export default AddVacantShopPage;