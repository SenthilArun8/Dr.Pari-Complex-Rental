import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMoneyBillWave, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { IoStorefrontSharp } from 'react-icons/io5'; // For shop icon
import { MdOutlineNumbers, MdOutlineMeetingRoom } from "react-icons/md"; // For shop number, floor number

// Helper function to format currency (e.g., add ₹ or $)
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  // Using Intl.NumberFormat for robust currency formatting
  // Adjust 'en-IN' and 'INR' for your specific locale and currency
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR', // Indian Rupees
    minimumFractionDigits: 0, // No decimal places for whole numbers
    maximumFractionDigits: 2, // Up to 2 decimal places if needed
  }).format(amount);
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Attempt to parse ISO string or Date object
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check for invalid date
      return 'Invalid Date';
    }
    // Format to a more readable locale-specific string
    return new Intl.DateTimeFormat('en-CA', { // Example: Canadian English format
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
};


// Component used for each tenant card
const Tenant = ({ tenant }) => { // Expects a prop called 'tenant' to be passed

  // No description to truncate for tenants based on your schema, so no need for showFullDescription state
  // const [showFullDescription, setShowFullDescription] = useState(false);

  const capitalizeWords = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Ensure rest of word is lowercase
      .join(' ');
  };

  const capitalizeSentence = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); // Ensure rest of sentence is lowercase
  };

  if (!tenant) {
    return null; // Or a loading message/skeleton loader
  }

  // Calculate Balance Amount Pending for display (you might also get this from the backend)
  const rent = tenant.rentAmount || 0;
  const paid1 = tenant.monthlyRentPaidAmount1 || 0;
  const paid2 = tenant.monthlyRentPaidAmount2 || 0;
  const totalPaid = paid1 + paid2;
  const balance = rent - totalPaid;

  return (
    <div className='bg-white rounded-xl shadow-md relative hover:shadow-lg transition-shadow duration-300'>
      <div className='p-6'>
        {/* Tenant Name */}
        <div className='mb-4 text-center'>
          <h3 className='text-3xl font-extrabold text-emerald-800 break-words'>{capitalizeWords(tenant.tenantName)}</h3>
        </div>

        <div className='border-t border-emerald-200 pt-4 mb-4'>
          <h4 className='text-xl font-bold text-emerald-700 mb-3'>Shop Details</h4>
          <ul className='space-y-2 text-emerald-900'>
            <li>
              <IoStorefrontSharp className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Shop Name:</strong> {capitalizeWords(tenant.shopName)}
            </li>
            <li>
              <MdOutlineNumbers className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Shop Number:</strong> {tenant.shopNumber}
            </li>
            <li>
              <MdOutlineMeetingRoom className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Floor Number:</strong> {tenant.floorNumber}
            </li>
            <li>
              <strong className='font-semibold'>Facing:</strong> {capitalizeWords(tenant.shopFacing)}
            </li>
          </ul>
        </div>

        <div className='border-t border-emerald-200 pt-4 mb-4'>
          <h4 className='text-xl font-bold text-emerald-700 mb-3'>Contact Information</h4>
          <ul className='space-y-2 text-emerald-900'>
            <li>
              <FaEnvelope className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Email:</strong> {tenant.tenantEmail || 'N/A'}
            </li>
            <li>
              <FaPhone className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Phone:</strong> {tenant.tenantPhoneNumber || 'N/A'}
            </li>
            <li>
              <strong className='font-semibold'>Address:</strong> {capitalizeSentence(tenant.tenantAddress) || 'N/A'}
            </li>
          </ul>
        </div>

        <div className='border-t border-emerald-200 pt-4 mb-4'>
          <h4 className='text-xl font-bold text-emerald-700 mb-3'>Financial Overview</h4>
          <ul className='space-y-2 text-emerald-900'>
            <li>
              <FaMoneyBillWave className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Monthly Rent:</strong> {formatCurrency(tenant.rentAmount)} (Due: {tenant.rentalPaymentDate}th)
            </li>
            <li>
              <FaMoneyBillWave className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Advance Payment:</strong> {formatCurrency(tenant.advancePay)}
            </li>
            <li>
              <FaCalendarAlt className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Advance Pay Date:</strong> {formatDate(tenant.advancePayDate)}
            </li>
            <li>
              <FaMoneyBillWave className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Paid (1st Installment):</strong> {formatCurrency(tenant.monthlyRentPaidAmount1)} {tenant.monthlyRentPaidDate1 ? `(${formatDate(tenant.monthlyRentPaidDate1)})` : ''}
            </li>
            {tenant.monthlyRentPaidAmount2 > 0 && ( // Only show if a second payment was made
                <li>
                  <FaMoneyBillWave className='inline text-lg mb-1 mr-2 text-emerald-600' />
                  <strong className='font-semibold'>Paid (2nd Installment):</strong> {formatCurrency(tenant.monthlyRentPaidAmount2)} {tenant.monthlyRentPaidDate2 ? `(${formatDate(tenant.monthlyRentPaidDate2)})` : ''}
                </li>
            )}
            <li className={`text-xl font-bold ${balance < 0 ? 'text-red-600' : (balance > 0 ? 'text-orange-600' : 'text-green-600')}`}>
              <strong className='font-semibold'>Balance Pending:</strong> {formatCurrency(balance)}
              {balance < 0 && <span className="ml-2 text-sm font-normal">(Overpaid)</span>}
              {balance === 0 && <span className="ml-2 text-sm font-normal">(Paid in Full)</span>}
            </li>
          </ul>
        </div>

        <div className='border-t border-emerald-200 pt-4 mb-4'>
          <h4 className='text-xl font-bold text-emerald-700 mb-3'>Other Details</h4>
          <ul className='space-y-2 text-emerald-900'>
            <li>
              <FaIdCard className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>TNEB Number:</strong> {tenant.TNEBNumber || 'N/A'}
            </li>
            <li>
              <FaCalendarAlt className='inline text-lg mb-1 mr-2 text-emerald-600' />
              <strong className='font-semibold'>Rent Increment Date:</strong> {formatDate(tenant.rentIncrementDate)}
            </li>
          </ul>
        </div>

        {/* Link to view/edit tenant details */}
        <div className='flex justify-center mt-6'>
          <Link
            to={`/tenants/${tenant._id}`} // {/* Assuming your route for individual tenant is /tenants/:id */}
            className='h-[42px] bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-lg text-center text-md font-semibold transition shadow-md hover:shadow-lg'
          >
            View / Edit Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tenant;