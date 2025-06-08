import { useParams, useLoaderData, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMoneyBillWave, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { IoStorefrontSharp } from 'react-icons/io5';
import { MdOutlineNumbers, MdOutlineMeetingRoom } from "react-icons/md";
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { useUser } from '../contexts/UserContext';

// --- Helper Functions (kept for consistency) ---
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
};

const capitalizeWords = (str) => {
  if (typeof str !== 'string' || !str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const capitalizeSentence = (str) => {
  if (typeof str !== 'string' || !str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
// --- End Helper Functions ---

const TenantPage = ({ deleteTenant }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const tenant = useLoaderData();
  const { user, token } = useUser(); // Get user and token from context

  // Now, authorization to edit/delete depends purely on whether the user is logged in (has a token)
  const isUserLoggedIn = !!token; // '!!' converts token (string or null) to boolean

  const onDeleteClick = async (tenantId) => {
    // User must be logged in to delete
    if (!isUserLoggedIn) {
      toast.info('You must be logged in to delete tenant profiles.');
      return;
    }

    const confirm = window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.');
    if (!confirm) return;

    try {
      await deleteTenant(tenantId);
      toast.success('Tenant deleted successfully');
      navigate('/tenants');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant.');
    }
  };

  // If the loader returns null/undefined (e.g., API call failed or tenant not found)
  if (!tenant) {
    return (
      <div className="bg-emerald-100 min-h-screen py-10 flex items-center justify-center">
        <div className="text-center bg-white/90 p-8 rounded-xl shadow-lg">
          <p className="text-2xl text-red-600 mb-4">Tenant Not Found</p>
          <p className="text-lg text-gray-700">The tenant with ID "{id}" could not be loaded.</p>
          <Link to="/tenants" className="mt-6 inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-full transition">
            <FaArrowLeft className="inline mr-2" /> Back to Tenants List
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Balance Amount Pending for display
  const rent = tenant.rentAmount || 0;
  const paid1 = tenant.monthlyRentPaidAmount1 || 0;
  const paid2 = tenant.monthlyRentPaidAmount2 || 0;
  const totalPaid = paid1 + paid2;
  const balance = rent - totalPaid;

  return (
    <>
      {/* Back Button Section */}
      <section className="bg-emerald-50 py-6 px-6">
        <div className="container m-auto">
          <Link
            to="/tenants"
            className="text-emerald-700 hover:text-emerald-900 flex items-center font-semibold"
          >
            <FaArrowLeft className="mr-2" /> Back to Tenants
          </Link>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-emerald-100 min-h-screen py-10">
        <div className="container m-auto px-6">
          <div className="w-full bg-white/90 rounded-xl shadow-lg p-8 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Tenant Details Column (Main Content) */}
              <main className="col-span-1">
                <div className="text-center md:text-left mb-6">
                  <h1 className="text-4xl font-extrabold mb-4 text-emerald-900">
                    {capitalizeWords(tenant.tenantName)}
                  </h1>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Shop:</span> {capitalizeWords(tenant.shopName)} (Shop No. {tenant.shopNumber})
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-emerald-50 p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-800">Contact Information</h3>
                  <ul className="space-y-3 text-emerald-900">
                    <li>
                      <FaPhone className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Phone Number:</strong> {tenant.tenantPhoneNumber || 'N/A'}
                    </li>
                    <li>
                      <FaEnvelope className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Email:</strong> {tenant.tenantEmail || 'N/A'}
                    </li>
                    <li>
                      <strong className='font-semibold'>Address:</strong> {capitalizeSentence(tenant.tenantAddress) || 'N/A'}
                    </li>
                  </ul>
                </div>

                {/* Shop Details */}
                <div className="bg-emerald-50 p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-800">Shop Details</h3>
                  <ul className="space-y-3 text-emerald-900">
                    <li>
                      <IoStorefrontSharp className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Shop Name:</strong> {capitalizeWords(tenant.shopName)}
                    </li>
                    <li>
                      <MdOutlineNumbers className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Shop Number:</strong> {tenant.shopNumber}
                    </li>
                    <li>
                      <MdOutlineMeetingRoom className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Floor Number:</strong> {tenant.floorNumber !== undefined ? tenant.floorNumber : 'N/A'}
                    </li>
                    <li>
                      <strong className='font-semibold'>Shop Facing:</strong> {capitalizeWords(tenant.shopFacing)}
                    </li>
                  </ul>
                </div>

                {/* Other Details */}
                <div className="bg-emerald-50 p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-800">Other Information</h3>
                  <ul className="space-y-3 text-emerald-900">
                    <li>
                      <FaIdCard className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>TNEB Number:</strong> {tenant.TNEBNumber || 'N/A'}
                    </li>
                    <li>
                      <FaCalendarAlt className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Rent Increment Date:</strong> {formatDate(tenant.rentIncrementDate)}
                    </li>
                  </ul>
                </div>
              </main>

              {/* Financial & Management Column (Sidebar) */}
              <aside className="col-span-1">
                {/* Financial Details */}
                <div className="bg-emerald-50 p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-800">Financial Details</h3>
                  <ul className="space-y-3 text-emerald-900">
                    <li>
                      <FaMoneyBillWave className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Monthly Rent:</strong> {formatCurrency(tenant.rentAmount)}
                      <span className="block text-sm text-gray-600 ml-6">Due by {tenant.rentalPaymentDate}th of each month</span>
                    </li>
                    <li>
                      <strong className='font-semibold'>Advance Payment (Deposit):</strong> {formatCurrency(tenant.advancePay)}
                    </li>
                    <li>
                      <FaCalendarAlt className='inline text-lg mb-1 mr-3 text-emerald-600' />
                      <strong className='font-semibold'>Advance Pay Date:</strong> {formatDate(tenant.advancePayDate)}
                    </li>
                    <li>
                      <strong className='font-semibold'>Monthly Rent Paid (1):</strong> {formatCurrency(tenant.monthlyRentPaidAmount1)}
                      {tenant.monthlyRentPaidDate1 && <span className="block text-sm text-gray-600 ml-6">on {formatDate(tenant.monthlyRentPaidDate1)}</span>}
                    </li>
                    {tenant.monthlyRentPaidAmount2 > 0 && (
                      <li>
                        <strong className='font-semibold'>Monthly Rent Paid (2):</strong> {formatCurrency(tenant.monthlyRentPaidAmount2)}
                        {tenant.monthlyRentPaidDate2 && <span className="block text-sm text-gray-600 ml-6">on {formatDate(tenant.monthlyRentPaidDate2)}</span>}
                      </li>
                    )}
                    <li className={`text-xl font-bold mt-4 ${balance < 0 ? 'text-red-600' : (balance > 0 ? 'text-orange-600' : 'text-green-600')}`}>
                      <strong className='font-semibold'>Balance Pending:</strong> {formatCurrency(balance)}
                      {balance < 0 && <span className="ml-2 text-sm font-normal">(Overpaid)</span>}
                      {balance === 0 && <span className="ml-2 text-sm font-normal">(Paid in Full)</span>}
                    </li>
                  </ul>
                </div>

                {/* Management Section */}
                <div className="bg-emerald-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold mb-6 text-emerald-800">
                    Manage Tenant
                  </h3>
                  {/* Edit Tenant Button/Link */}
                  <Link
                    to={!isUserLoggedIn ? '#' : `/edit-tenant/${tenant._id}`}
                    className={`
                      ${!isUserLoggedIn ? 'bg-emerald-300 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'}
                      text-white text-center font-bold py-3 px-6 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block transition duration-200 ease-in-out
                    `}
                    onClick={(e) => {
                      if (!isUserLoggedIn) {
                        e.preventDefault();
                        toast.info('Please log in to edit tenant profiles.');
                      }
                    }}
                  >
                    Edit Tenant
                  </Link>
                  {/* Delete Tenant Button */}
                  <button
                    onClick={() => onDeleteClick(tenant._id)}
                    className={`
                      ${!isUserLoggedIn ? 'bg-red-300 cursor-not-allowed opacity-50' : 'bg-red-500 hover:bg-red-600'}
                      text-white font-bold py-3 px-6 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block transition duration-200 ease-in-out
                    `}
                    disabled={!isUserLoggedIn}
                  >
                    Delete Tenant
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Loader function for React Router
const tenantLoader = async ({ params }) => {
  console.log('Attempting to load tenant with ID:', params.id);
  try {
    // Ensure this URL matches your backend API route exactly for a single tenant
    const res = await axiosInstance.get(`/tenants/${params.id}`);
    console.log('Tenant data successfully loaded:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching tenant:', error.response ? error.response.data : error.message);
    toast.error('Failed to load tenant details.');
    // Return null to allow the component to render its "Tenant Not Found" UI
    return null;
  }
};

export { TenantPage as default, tenantLoader };