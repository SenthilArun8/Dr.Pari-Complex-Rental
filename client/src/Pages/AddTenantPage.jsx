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
  const [monthlyRentPaidAmount1, setMonthlyRentPaidAmount1] = useState('');
  const [monthlyRentPaidAmount2 , setMonthlyRentPaidAmount2] = useState('');
  const [monthlyRentPaidDate1, setMonthlyRentPaidDate1] = useState('');
  const [monthlyRentPaidDate2, setMonthlyRentPaidDate2] = useState('');
  const [isMonthlyRentPaidDate1Invalid, setIsMonthlyRentPaidDate1Invalid] = useState(false);
  const [isMonthlyRentPaidDate2Invalid, setIsMonthlyRentPaidDate2Invalid] = useState(false);
  const [balanceAmountPending, setBalanceAmountPending] = useState('');
  const [TNEBNumber, setTNEBNumber] = useState('');
  const [rentIncrementDate, setRentIncrementDate] = useState('');
  const [isRentIncrementDateInvalid, setIsRentIncrementDateInvalid] = useState(false)

  // --- Context and Navigation ---
  const { user, token } = useUser();
  const navigate = useNavigate();

  // NEW: Create a ref for the Calendar component
  const calendarRef = useRef(null);
  const rentIncrementCalendarRef = useRef(null); // Ref for rent increment date calendar
  const monthlyRentPaidCalendarRef1 = useRef(null); // Ref for monthly rent paid date 1 calendar
  const monthlyRentPaidCalendarRef2 = useRef(null); // Ref for monthly rent paid date 2 calendar

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  /// Initialize calendarFocusedDate when the component mounts or advancePayDate changes
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

    // Calculate rent increment date based on advancePayDate
    useEffect(() => {
        if (advancePayDate) {
            try {
                const parsedAdvanceDate = parseDate(advancePayDate);
                // Add exactly two years to the advancePayDate
                const incrementDate = parsedAdvanceDate.add({ years: 2 });
                setRentIncrementDate(incrementDate.toString());
                setIsRentIncrementDateInvalid(false);
            } catch (error) {
                console.error("Error calculating rent increment date:", error);
                setRentIncrementDate('');
                setIsRentIncrementDateInvalid(true);
            }
        } else {
            setRentIncrementDate('');
        }
    }, [advancePayDate])

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

  // Calculate rent increment date based on advancePayDate
    useEffect(() => {
        if (advancePayDate) {
            try {
                const parsedAdvanceDate = parseDate(advancePayDate);
                // Add exactly two years to the advancePayDate
                const incrementDate = parsedAdvanceDate.add({ years: 2 });
                setRentIncrementDate(incrementDate.toString());
                setIsRentIncrementDateInvalid(false);
            } catch (error) {
                console.error("Error calculating rent increment date:", error);
                setRentIncrementDate('');
                setIsRentIncrementDateInvalid(true);
            }
        } else {
            setRentIncrementDate('');
        }
    }, [advancePayDate]);


    // Debugging useEffect for advancePayDate state changes
    useEffect(() => {
        console.log("Current advancePayDate state:", advancePayDate);
    }, [advancePayDate]);

    // Auto-calculate Balance Amount Pending
    useEffect(() => {
        const rent = parseFloat(rentAmount);
        const paid1 = parseFloat(monthlyRentPaidAmount1);
        const paid2 = parseFloat(monthlyRentPaidAmount2) || 0;

        if (!isNaN(rent) && !isNaN(paid1)) {
            setBalanceAmountPending((rent - (paid1 + paid2)).toFixed(2)); // Format to 2 decimal places
        } else {
            setBalanceAmountPending(''); // Clear if inputs are not valid numbers
        }
    }, [rentAmount, monthlyRentPaidAmount1, monthlyRentPaidAmount2]); // Recalculate when rentAmount or monthlyRentPaidAmount changes



  const toIsoDateString = (dateValue) => {
    if (!dateValue) {
        console.log("toIsoDateString: dateValue is null/undefined, returning empty string.");
        return '';
    }
    // The toString() method of DateValue often gives "YYYY-MM-DD"
    return dateValue.toString();
  };

  // Handler for when the advancePayDate input field loses focus
    const handleAdvancePayDateInputBlur = (e) => {
        const typedDateString = e.target.value;

        if (typedDateString === '') {
            setAdvancePayDate('');
            setIsAdvancePayDateInvalid(false);
            setCalendarFocusedDate(null);
            return;
        }

        try {
            const parsedDate = parseDate(typedDateString);
            setAdvancePayDate(parsedDate.toString());
            setIsAdvancePayDateInvalid(false);

            if (calendarRef.current) {
                if (typeof calendarRef.current.focusDate === 'function') {
                    console.log("Attempting to focus calendar via ref.focusDate:", parsedDate);
                    calendarRef.current.focusDate(parsedDate);
                } else if (typeof calendarRef.current.setDate === 'function') {
                    console.log("Attempting to focus calendar via ref.setDate:", parsedDate);
                    calendarRef.current.setDate(parsedDate);
                } else {
                    console.log("Direct calendar ref method not found, updating calendarFocusedDate state.");
                    setCalendarFocusedDate(parsedDate);
                }
            } else {
                setCalendarFocusedDate(parsedDate);
            }
        } catch (error) {
            console.error("Invalid date typed:", typedDateString, error);
            toast.error('Invalid date format for Advance Pay Date. Please use YYYY-MM-DD (e.g., 2025-01-31).');
            setIsAdvancePayDateInvalid(true);
            setCalendarFocusedDate(null);
        }
    };

    // Function to handle blur for any monthly rent paid date input
    const handleMonthlyRentPaidDateInputBlur = (e, setDateState, setIsInvalidState) => {
        const typedDateString = e.target.value;

        if (typedDateString === '') {
            setDateState('');
            setIsInvalidState(false);
            return;
        }

        try {
            const parsedDate = parseDate(typedDateString);
            setDateState(parsedDate.toString());
            setIsInvalidState(false);
            // You might want to update the calendar's focused date here too if you link a calendar to this input
            // For example, if you had a ref specific to monthlyRentPaidCalendarRef1 or monthlyRentPaidCalendarRef2
            // if (monthlyRentPaidCalendarRef.current && typeof monthlyRentPaidCalendarRef.current.focusDate === 'function') {
            //     monthlyRentPaidCalendarRef.current.focusDate(parsedDate);
            // }
        } catch (error) {
            console.error("Invalid date typed:", typedDateString, error);
            toast.error('Invalid date format for Monthly Rent Paid Date. Please use YYYY-MM-DD (e.g., 2025-01-31).');
            setIsInvalidState(true);
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
      shopName,
      shopNumber,
      shopFacing,
      floorNumber: Number(floorNumber), // Ensure number type for schema
      tenantName,
      tenantAddress,
      tenantPhoneNumber,
      tenantEmail,
      advancePay: Number(advancePay), // Ensure number type for schema
      advancePayDate, // Date string will be parsed by Mongoose
      rentalPaymentDate: Number(rentalPaymentDate), // Ensure number type for schema
      rentAmount: Number(rentAmount), // Ensure number type for schema
      monthlyRentPaidAmount1: Number(monthlyRentPaidAmount1),
      monthlyRentPaidAmount2: Number(monthlyRentPaidAmount2),
      monthlyRentPaidDate1,
      monthlyRentPaidDate2,
      balanceAmountPending: Number(balanceAmountPending),
      TNEBNumber,
      rentIncrementDate
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
    { key: 'monthlyRentPaidAmount1', label: 'Monthly Rent Paid Amount 1', description: 'Enter the rent amount paid for the current month.' },
    { key: 'monthlyRentPaidAmount2', label: 'Monthly Rent Paid Amount 2', description: 'Enter the rent amount paid for the current month if not paid in full' },
    { key: 'monthlyRentPaidDate1', label: 'Monthly Rent Paid Date 1', description: 'Select the date the first monthly rent was paid.' },
    { key: 'monthlyRentPaidDate2', label: 'Monthly Rent Paid Date 2', description: 'Select the date the second monthly rent was paid.' },
    { key: 'balanceAmountPending', label: 'Balance Amount Pending', description: 'Enter any outstanding balance amount for rent.' },
    { key: 'TNEBNumber', label: 'TNEB Number', description: 'Enter the Tamil Nadu Electricity Board (TNEB) customer number for the shop.' },
    { key: 'rentIncrementDate', label: 'Rent Increment Date', description: 'This date is automatically calculated as two years after the Advance Payment Date.' },
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
          onBlur={handleAdvancePayDateInputBlur}
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
              placeholder="e.g. ₹1200"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              required
              min="0"
              onFocus={() => handleSpotlightFocus('rentAmount')}
            />
          </div>

          {/* NEW: Monthly Rent Paid Amount */}
        <div className={`mb-4 relative ${isSpotlight('monthlyRentPaidAmount1') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('monthlyRentPaidAmount1') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Paid Amount 1</label>
            <input
                type="number"
                className="border border-emerald-300 rounded w-full py-2 px-3"
                placeholder="e.g. ₹1200"
                value={monthlyRentPaidAmount1}
                onChange={(e) => setMonthlyRentPaidAmount1(e.target.value)}
                required
                min="0"
                onFocus={() => handleSpotlightFocus('monthlyRentPaidAmount1')}
            />
        </div>

        <div className={`mb-4 relative ${isSpotlight('monthlyRentPaidAmount2') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
            {isSpotlight('monthlyRentPaidAmount2') && showTutorial && <TutorialTooltip step={tutorialStep} />}
            <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Paid Amount 2</label>
            <input
                type="number"
                className="border border-emerald-300 rounded w-full py-2 px-3"
                placeholder="e.g. ₹1200"
                value={monthlyRentPaidAmount2}
                onChange={(e) => setMonthlyRentPaidAmount2(e.target.value)}
                required
                min="0"
                onFocus={() => handleSpotlightFocus('monthlyRentPaidAmount2')}
            />
        </div>

            {/* NEW: Monthly Rent Paid Date */}
            <div className={`mb-4 relative ${isSpotlight('monthlyRentPaidDate1') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
                {isSpotlight('monthlyRentPaidDate1') && showTutorial && <TutorialTooltip step={tutorialStep} />}
                <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Paid Date 1</label>
                <Calendar
                    aria-label="Monthly Rent Paid Date 1"
                    value={getCalendarValue(monthlyRentPaidDate1)}
                    onChange={(dateValue) => {
                        const newDateString = toIsoDateString(dateValue);
                        setMonthlyRentPaidDate1(newDateString);
                        setIsMonthlyRentPaidDate1Invalid(false);
                    }}
                    className="my-custom-calendar"
                    style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                    focusedDate={getCalendarValue(monthlyRentPaidDate1)}
                    ref={monthlyRentPaidCalendarRef1}
                />
                <div className="mt-4">
                    <label className="block text-emerald-900 font-bold mb-2">Or Type Date Manually (YYYY-MM-DD):</label>
                    <input
                        type="text"
                        className={`border rounded w-full py-2 px-3 ${isMonthlyRentPaidDate1Invalid ? 'border-red-500' : 'border-emerald-300'}`}
                        placeholder="YYYY-MM-DD"
                        value={monthlyRentPaidDate1}
                        onChange={(e) => {
                            setMonthlyRentPaidDate1(e.target.value);
                            if (isMonthlyRentPaidDate1Invalid) {
                                setIsMonthlyRentPaidDate1Invalid(false);
                            }
                        }}
                        onBlur={handleMonthlyRentPaidDateInputBlur}
                        onFocus={() => handleSpotlightFocus('monthlyRentPaidDate1')}
                    />
                    {isMonthlyRentPaidDate1Invalid && <p className="text-red-500 text-sm mt-1">Invalid date format.</p>}
                </div>
            </div>

            <div className={`mb-4 relative ${isSpotlight('monthlyRentPaidDate2') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
                {isSpotlight('monthlyRentPaidDate2') && showTutorial && <TutorialTooltip step={tutorialStep} />}
                <label className="block text-emerald-900 font-bold mb-2">Monthly Rent Paid Date 2</label>
                <Calendar
                    aria-label="Monthly Rent Paid Date 2"
                    value={getCalendarValue(monthlyRentPaidDate2)}
                    onChange={(dateValue) => {
                        const newDateString = toIsoDateString(dateValue);
                        setMonthlyRentPaidDate2(newDateString);
                        setIsMonthlyRentPaidDate2Invalid(false);
                    }}
                    className="my-custom-calendar"
                    style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                    focusedDate={getCalendarValue(monthlyRentPaidDate2)}
                    ref={monthlyRentPaidCalendarRef2}
                />
                <div className="mt-4">
                    <label className="block text-emerald-900 font-bold mb-2">Or Type Date Manually (YYYY-MM-DD):</label>
                    <input
                        type="text"
                        className={`border rounded w-full py-2 px-3 ${isMonthlyRentPaidDate2Invalid ? 'border-red-500' : 'border-emerald-300'}`}
                        placeholder="YYYY-MM-DD"
                        value={monthlyRentPaidDate2}
                        onChange={(e) => {
                            setMonthlyRentPaid2Date(e.target.value);
                            if (isMonthlyRentPaidDate2Invalid) {
                                setIsMonthlyRentPaidDate2Invalid(false);
                            }
                        }}
                        onBlur={handleMonthlyRentPaidDateInputBlur}
                        onFocus={() => handleSpotlightFocus('monthlyRentPaidDate2')}
                    />
                    {isMonthlyRentPaidDate2Invalid && <p className="text-red-500 text-sm mt-1">Invalid date format.</p>}
                </div>
            </div>

            {/* Balance Amount Pending (Now Auto-calculated and Read-Only) */}
            <div className={`mb-4 relative ${isSpotlight('balanceAmountPending') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
                {isSpotlight('balanceAmountPending') && showTutorial && <TutorialTooltip step={tutorialStep} />}
                <label className="block text-emerald-900 font-bold mb-2">Balance Amount Pending</label>
                <input
                    type="number"
                    className="border border-emerald-300 rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed" // Added styles for read-only
                    placeholder="Auto-calculated"
                    value={balanceAmountPending}
                    readOnly //  <--- THIS IS KEY: Makes the input uneditable by the user
                    onFocus={() => handleSpotlightFocus('balanceAmountPending')}
                />
                <p className="text-sm text-gray-600 mt-1">Automatically calculated as (Monthly Rent - Monthly Rent Paid).</p>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <h3 className="text-2xl mt-6 mb-4 text-emerald-800">Additional Information</h3>
            {/* NEW: TNEB Number */}
            <div className={`mb-4 relative ${isSpotlight('TNEBNumber') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
                {isSpotlight('TNEBNumber') && showTutorial && <TutorialTooltip step={tutorialStep} />}
                <label className="block text-emerald-900 font-bold mb-2">TNEB (Tamil Nadu Electricity Board) Number: </label>
                <input
                    type="text" // TNEB number might contain letters, so keeping it as text
                    className="border border-emerald-300 rounded w-full py-2 px-3"
                    placeholder="e.g. 01234567890"
                    value={TNEBNumber}
                    onChange={(e) => setTNEBNumber(e.target.value)}
                    onFocus={() => handleSpotlightFocus('TNEBNumber')}
                />
            </div>

           <div className={`mb-4 relative ${isSpotlight('rentIncrementDate') ? 'ring-4 ring-emerald-400 z-50 bg-white p-1' : ''}`}>
             {isSpotlight('rentIncrementDate') && showTutorial && <TutorialTooltip step={tutorialStep} />}
             <label className="block text-emerald-900 font-bold mb-2">Rent Increment Notification Date (Auto-calculated)</label>
             <Calendar
                 aria-label="Rent Increment Date"
                 value={getCalendarValue(rentIncrementDate)}
                 onChange={(dateValue) => {
                     // This calendar is primarily for display; direct editing is via input
                     const newDateString = toIsoDateString(dateValue);
                     setRentIncrementDate(newDateString);
                 }}
                 className="my-custom-calendar"
                 style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                 focusedDate={getCalendarValue(rentIncrementDate)} // Focus on the calculated date
                 ref={rentIncrementCalendarRef}
                 isReadOnly // Make calendar read-only as it's auto-calculated
             />
             <div className="mt-4">
                 <label className="block text-emerald-900 font-bold mb-2">Calculated Date (YYYY-MM-DD):</label>
                 <input
                     type="text"
                     className={`border rounded w-full py-2 px-3 ${isRentIncrementDateInvalid ? 'border-red-500' : 'border-emerald-300'}`}
                     value={rentIncrementDate}
                     readOnly // Make the input read-only
                     onFocus={() => handleSpotlightFocus('rentIncrementDate')}
                 />
                 {isRentIncrementDateInvalid && <p className="text-red-500 text-sm mt-1">Cannot calculate. Please check Advance Pay Date.</p>}
             </div>
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