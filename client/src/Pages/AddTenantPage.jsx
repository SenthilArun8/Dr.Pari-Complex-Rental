import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../utils/axios';
import { Calendar } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import '../index.css'

// Assuming this component will be passed a function to submit the new tenant
// If you want it to directly call the API, you can remove `addTenantSubmit` prop
const AddTenantPage = () => { // Changed prop name to reflect tenant context
  // --- Tenant State Fields (from your Tenant Model) ---
  const [shopNumber, setShopNumber] = useState('');
  const [shopFacing, setShopFacing] = useState('');
  const [shopName, setShopName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [tenantPhoneNumber, setTenantPhoneNumber] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [advancePay, setAdvancePay] = useState('');
  const [advancePayDate, setAdvancePayDate] = useState('');
  const [isAdvancePayDateInvalid, setIsAdvancePayDateInvalid] = useState(false);
  const [calendarFocusedDate, setCalendarFocusedDate] = useState(null);
  const [rentalPaymentDate, setRentalPaymentDate] = useState('');
  const [rentAmount, setRentAmount] = useState('');

  // --- Context and Navigation ---
  const { user, token } = useUser();
  const navigate = useNavigate();

  // NEW: Create a ref for the Calendar component
  const calendarRef = useRef(null);


  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Initialize calendarFocusedDate when the component mounts or advancePayDate changes
    // This ensures the calendar starts on the month of the initial advancePayDate if one exists.
    useEffect(() => {
        const initialParsedDate = getCalendarValue(advancePayDate);
        if (initialParsedDate) {
            setCalendarFocusedDate(initialParsedDate);
        }
    }, []); // Run once on mount to set initial focus

  // Debugging useEffect for advancePayDate state changes
  useEffect(() => {
    console.log("Current advancePayDate state:", advancePayDate);
  }, [advancePayDate]);

  // Helper functions to convert between string and the calendar's internal date object
  const getCalendarValue = (dateString) => {
    if (!dateString) {
        console.log("getCalendarValue: dateString is empty, returning null.");
        return null;
    }
    try {
      const parsed = parseDate(dateString);
      console.log("getCalendarValue: Successfully parsed", dateString, "to", parsed);
      // parseDate expects a string like "YYYY-MM-DD"
      return parseDate(dateString);
    } catch (e) {
      console.error("Error parsing date for Calendar:", dateString, e);
      return null;
    }
  };

  const toIsoDateString = (dateValue) => {
    if (!dateValue) {
        console.log("toIsoDateString: dateValue is null/undefined, returning empty string.");
        return '';
    }
    // The toString() method of DateValue often gives "YYYY-MM-DD"
    return dateValue.toString();
  };

  // NEW: Handler for when the date input field loses focus
   const handleDateInputBlur = (e) => {
    const typedDateString = e.target.value;

    if (typedDateString === '') {
        setAdvancePayDate('');
        setIsAdvancePayDateInvalid(false);
        setCalendarFocusedDate(null); // Reset calendar focus if input is empty
        return;
    }

    try {
        const parsedDate = parseDate(typedDateString);
        setAdvancePayDate(parsedDate.toString());
        setIsAdvancePayDateInvalid(false);

        // --- CRITICAL CHANGE: Imperative Navigation via Ref ---
        if (calendarRef.current) {
            // Attempt to use focusDate if available (common for React Aria based components)
            if (typeof calendarRef.current.focusDate === 'function') {
                console.log("Attempting to focus calendar via ref.focusDate:", parsedDate);
                calendarRef.current.focusDate(parsedDate);
            }
            // Fallback to setDate if focusDate is not present
            else if (typeof calendarRef.current.setDate === 'function') {
                console.log("Attempting to focus calendar via ref.setDate:", parsedDate);
                calendarRef.current.setDate(parsedDate);
            }
            // If neither specific method exists, update the state that the calendar consumes
            // This is a more reactive approach if direct imperative methods aren't exposed
            else {
                 console.log("Direct calendar ref method not found, updating calendarFocusedDate state.");
                 setCalendarFocusedDate(parsedDate);
            }
        } else {
            // If ref is not yet available, still update the state;
            // this handles the initial render case or if ref is null for some reason.
            setCalendarFocusedDate(parsedDate);
        }
        // --- END CRITICAL CHANGE ---

    } catch (error) {
        console.error("Invalid date typed:", typedDateString, error);
        toast.error('Invalid date format. Please use YYYY-MM-DD (e.g., 2025-01-31).');
        setIsAdvancePayDateInvalid(true);
        setCalendarFocusedDate(null); // Clear calendar focus if date is invalid
    }
};

  // --- Form Submission Handler ---
  const submitForm = async (e) => { // Made async to directly use await
    e.preventDefault();

    if (!token) {
      toast.error('Please log in first.');
      return;
    }

    // You no longer need to parse the token to get userId if your backend uses `req.user._id`
    // from the `protect` middleware, as `axiosInstance` sends the token.
    // However, if you need it on the frontend for some reason:
    // const userId = JSON.parse(atob(token.split('.')[1])).id;

    const newTenant = {
      shopNumber,
      shopFacing,
      shopName,
      floorNumber: Number(floorNumber), // Ensure number type for schema
      tenantName,
      tenantAddress,
      tenantPhoneNumber,
      tenantEmail,
      advancePay: Number(advancePay), // Ensure number type for schema
      advancePayDate, // Date string will be parsed by Mongoose
      rentalPaymentDate: Number(rentalPaymentDate), // Ensure number type for schema
      rentAmount: Number(rentAmount), // Ensure number type for schema
      // No need to manually add `user` field here, as your backend's `protect` middleware
      // will attach `req.user._id` before saving to the database.
      // If `req.user._id` is not set by middleware, you might need `user: userId` here.
    };

    try {
      // Call your backend API to add a new tenant
      const response = await axiosInstance.post('/tenants', newTenant); // Matches your app.use('/tenants', tenantRoutes)

      console.log('New Tenant Added:', response.data);
      toast.success('Tenant added successfully!');
      navigate('/tenants'); // Navigate to a page showing all tenants or tenant details
    } catch (error) {
      console.error('Failed to add tenant:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add tenant.');
    }
  };

  // --- Tutorial Steps (Simplified for Tenant context) ---
  const tutorialSteps = [
    { key: 'shopName', label: 'Shop Name', description: 'Enter the name of the shop (e.g., "Main Street Cafe").' },
    { key: 'shopNumber', label: 'Shop Number', description: 'Enter the unique number for this shop unit.' },
    { key: 'shopFacing', label: 'Shop Facing', description: 'Specify the direction the shop faces (e.g., East, Road-facing).' },
    { key: 'floorNumber', label: 'Floor Number', description: 'Enter the floor number of the shop.' },
    { key: 'tenantName', label: 'Tenant Name', description: 'Enter the full name of the tenant.' },
    { key: 'tenantAddress', label: 'Tenant Address', description: 'Enter the tenant\'s full address.' },
    { key: 'tenantPhoneNumber', label: 'Phone Number', description: 'Enter the tenant\'s contact phone number.' },
    { key: 'tenantEmail', label: 'Email', description: 'Enter the tenant\'s email address.' },
    { key: 'advancePay', label: 'Advance Payment', description: 'Enter the initial advance payment or security deposit amount.' },
    { key: 'advancePayDate', label: 'Advance Pay Date', description: 'Select the date the advance payment was received.' },
    { key: 'rentalPaymentDate', label: 'Payment Due Date', description: 'Enter the day of the month rent is due (e.g., 1 for 1st).' },
    { key: 'rentAmount', label: 'Monthly Rent', description: 'Enter the monthly rent amount.' },
  ];

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [dontShowTutorial, setDontShowTutorial] = useState(
    localStorage.getItem('hideAddTenantTutorial') === 'true' // Changed local storage key
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
    localStorage.setItem('hideAddTenantTutorial', 'true'); // Changed local storage key
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
      <div className="w-full max-w-2xl p-8 backdrop-blur-md bg-white/70 rounded-xl shadow-lg relative z-20">
        {/* Top padding before form */}
        <div className="py-4" />
        <form onSubmit={submitForm}>
          <h2 className="text-3xl text-center font-bold text-emerald-800 mb-8">Add New Tenant</h2>

          {/* Shop Details */}
          <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Shop Details</h3>
          <div className={`mb-4 relative ${isSpotlight('shopName') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('shopName') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Shop Name</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. The Coffee Bean"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('shopName')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('shopNumber') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('shopNumber') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Shop Number</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. A-101"
              value={shopNumber}
              onChange={(e) => setShopNumber(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('shopNumber')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('shopFacing') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('shopFacing') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Shop Facing</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. East, Road-facing"
              value={shopFacing}
              onChange={(e) => setShopFacing(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('shopFacing')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('floorNumber') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('floorNumber') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Floor Number</label>
            <input
              type="number"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 1"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('floorNumber')}
            />
          </div>

          {/* Tenant Personal Information */}
          <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Tenant Personal Information</h3>
          <div className={`mb-4 relative ${isSpotlight('tenantName') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('tenantName') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Tenant Name</label>
            <input
              type="text"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. John Doe"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('tenantName')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('tenantAddress') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('tenantAddress') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Tenant Address</label>
            <textarea
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 123 Main St, Anytown, ON A1B 2C3"
              value={tenantAddress}
              onChange={(e) => setTenantAddress(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('tenantAddress')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('tenantPhoneNumber') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('tenantPhoneNumber') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Tenant Phone Number</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 123-456-7890"
              value={tenantPhoneNumber}
              onChange={(e) => setTenantPhoneNumber(e.target.value)}
              required
              onFocus={() => handleSpotlightFocus('tenantPhoneNumber')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('tenantEmail') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('tenantEmail') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Tenant Email</label>
            <input
              type="email" // Use type="email" for email addresses
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. john.doe@example.com"
              value={tenantEmail}
              onChange={(e) => setTenantEmail(e.target.value)}
              onFocus={() => handleSpotlightFocus('tenantEmail')}
            />
          </div>

          {/* Financial Details */}
          <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Financial Details</h3>
          <div className={`mb-4 relative ${isSpotlight('advancePay') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('advancePay') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Advance Payment (Deposit)</label>
            <input
              type="number"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 1500"
              value={advancePay}
              onChange={(e) => setAdvancePay(e.target.value)}
              required
              min="0" // Advance pay should be non-negative
              onFocus={() => handleSpotlightFocus('advancePay')}
            />
          </div>

              <div className={`mb-4 relative ${isSpotlight('advancePayDate') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
      {isSpotlight('advancePayDate') && showTutorial && <TutorialTooltip step={tutorialStep} />}
      <label className="block text-emerald-900 font-bold mb-2">Advance Payment Date</label>

      <Calendar
        aria-label="Advance Payment Date"
        value={getCalendarValue(advancePayDate)} // This highlights the selected date
        onChange={(dateValue) => {
            const newDateString = toIsoDateString(dateValue);
            console.log("Calendar onChange: Attempting to set advancePayDate to", newDateString);
            setAdvancePayDate(newDateString);
            setIsAdvancePayDateInvalid(false);
            // When selected via calendar, also update the focused date for consistency
            setCalendarFocusedDate(dateValue); // <--- Keep this for consistency
        }}
        className="my-custom-calendar"
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        focusedDate={calendarFocusedDate} // <--- Pass the state controlling the displayed month
        ref={calendarRef} // <--- Attach the ref here
        />

      <div className="mt-4">
        <label className="block text-emerald-900 font-bold mb-2">Or Type Date Manually (YYYY-MM-DD):</label>
        <input
          type="text"
          className={`border rounded w-full py-2 px-3 ${isAdvancePayDateInvalid ? 'border-red-500' : 'border-emerald-300'}`}
          placeholder="YYYY-MM-DD"
          value={advancePayDate}
          onChange={(e) => {
            setAdvancePayDate(e.target.value);
            if (isAdvancePayDateInvalid) {
              setIsAdvancePayDateInvalid(false);
            }
          }}
          onBlur={handleDateInputBlur}
        />
      </div>
    </div>


          <div className={`mb-4 relative ${isSpotlight('rentalPaymentDate') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('rentalPaymentDate') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Due Date (Day of Month)</label>
            <input
              type="number"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 1 (for 1st of the month)"
              value={rentalPaymentDate}
              onChange={(e) => setRentalPaymentDate(e.target.value)}
              required
              min="1"
              max="31"
              onFocus={() => handleSpotlightFocus('rentalPaymentDate')}
            />
          </div>

          <div className={`mb-4 relative ${isSpotlight('rentAmount') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('rentAmount') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Amount</label>
            <input
              type="number"
              className="border border-emerald-300 rounded w-full py-2 px-3"
              placeholder="e.g. 1200"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              required
              min="0"
              onFocus={() => handleSpotlightFocus('rentAmount')}
            />
          </div>

          <div>
            <button
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add New Tenant
            </button>
          </div>
        </form>
        {/* Bottom padding after form */}
        <div className="py-4" />
      </div>
      {/* Side floating buttons */}
      <div className="hidden md:flex flex-col gap-4 fixed bottom-8 right-8 z-20">
        <button
          className="bg-white border border-emerald-300 text-emerald-700 px-4 py-2 rounded shadow hover:bg-emerald-50 font-semibold"
          onClick={handleScrollToTop}
          type="button"
        >
          ↑ Top
        </button>
        {showTutorial && (
          <button
            className="bg-white border border-emerald-300 text-emerald-700 px-4 py-2 rounded shadow hover:bg-emerald-50 font-semibold"
            onClick={handleDontShowTutorial}
          >
            Don&apos;t show tutorial again
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTenantPage;