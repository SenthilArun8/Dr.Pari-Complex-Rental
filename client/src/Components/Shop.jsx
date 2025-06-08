import { Link } from 'react-router-dom';
import { MdOutlineNumbers } from "react-icons/md"; // For shop number icon
import { BsArrowsMove } from "react-icons/bs"; // For dimensions icon
import { IoImageOutline } from "react-icons/io5"; // For image placeholder icon
import { FaPhoneAlt } from "react-icons/fa"; // For contact icon
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; // Updated: Using FaPencilAlt for edit, FaTrash for delete
import axiosInstance from '../utils/axios'; // For the delete request

const Shop = ({ shop, user, onDelete }) => { // Accept 'onDelete' prop
 const defaultShopImage = 'https://via.placeholder.com/150x100?text=Shop+Image';

 // --- DEBUGGING START ---
 console.log('Shop component received user:', user);
 if (user) {
  console.log('User role:', user.role);
  console.log('Is user an admin?', user.role === 'admin');
 }
 // --- DEBUGGING END ---

 if (!shop) {
  return null;
 }

 // Handle Delete (You'd typically want a confirmation dialog here)
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete Shop ${shop.shopNumber}? This action cannot be undone.`)) {
      try {
        // --- FIX START ---
        // REMOVED: if (!user || !user.token) { ... }
        // REMOVED: const config = { headers: { Authorization: `Bearer ${user.token}`, }, };
        // AXIOS INSTANCE INTERCEPTOR WILL AUTOMATICALLY ADD THE TOKEN FROM LOCALSTORAGE
        // --- FIX END ---

        const response = await axiosInstance.delete(`/vacant-shops/${shop._id}`); // Simplified call

        // Check for success message from backend if applicable
        if (response.status === 200) { // Assuming 200 OK for successful deletion
            alert(`Shop ${shop.shopNumber} deleted successfully!`);
            // Call the onDelete prop to update the parent component's state
            if (onDelete) {
              onDelete(shop._id);
            }
        } else {
            // Handle unexpected non-200 responses
            alert(`Failed to delete shop: Unexpected response status ${response.status}`);
        }

      } catch (error) {
        console.error('Error deleting shop:', error.response?.data?.message || error.message);
        alert(`Failed to delete shop: ${error.response?.data?.message || error.message}`);
        // Optionally, if the error is 401/403, you might redirect to login or refresh token
      }
    }
  };

 return (
  <div className='bg-white rounded-xl shadow-md relative hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4 sm:p-6'>
   {/* Admin Actions (Edit/Delete) - Top Right Corner */}
   {user && user.role === 'admin' && (
    <div className="absolute top-2 right-2 flex space-x-2 z-10">
     <Link
      to={`/edit-vacant-shops/${shop._id}`} // Assuming an edit page route
      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition flex items-center justify-center"
      title="Edit Shop"
     >
      <FaPencilAlt className="w-5 h-5" />
     </Link>
     <button
      onClick={handleDelete}
      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition flex items-center justify-center"
      title="Delete Shop"
     >
      <FaTrash className="w-5 h-5" />
     </button>
    </div>
   )}

   {/* Shop Name/Number (Above everything) */}
   <h3 className='text-2xl sm:text-3xl font-extrabold text-emerald-800 mb-3 sm:mb-4'>
    <MdOutlineNumbers className='inline text-2xl sm:text-3xl mb-1 mr-2 text-emerald-600' />
    Shop {shop.shopNumber}
   </h3>

   <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
    {/* Shop Image (Left side on desktop, top on mobile) */}
    <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
     {shop.imageUrl ? (
      <img
       src={shop.imageUrl}
       alt={`Shop ${shop.shopNumber}`}
       className="w-full h-full object-cover"
       onError={(e) => { e.target.onerror = null; e.target.src = defaultShopImage; }}
      />
     ) : (
      <div className="text-gray-500 text-xs text-center flex flex-col items-center justify-center">
       <IoImageOutline className="text-3xl sm:text-4xl text-gray-400" />
       No Image
      </div>
     )}
    </div>

    {/* Details & Contact Section */}
    <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between w-full">
     {/* Dimensions */}
     <p className='text-lg sm:text-xl font-bold flex items-center mb-3 sm:mb-0'>
      <BsArrowsMove className='inline text-xl sm:text-2xl mr-2 text-emerald-600' />
      {shop.dimensions || 'Dimensions N/A'}
     </p>

     {/* Vertical Divider (desktop) & Horizontal Divider (mobile) */}
     <div className="hidden sm:block border-l border-gray-300 h-12 mx-4 lg:mx-6"></div>
     <div className="block sm:hidden border-b border-gray-200 w-full my-3"></div>

     {/* Contact Button */}
    <Link
      to="/contact"
      // Retained the sizing, removed mx-auto here
      className='flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 shadow-md text-base sm:text-lg w-full sm:w-auto'
    >
      <FaPhoneAlt className='mr-2 text-lg sm:text-xl' /> Contact Us
      </Link>
    </div>
   </div>
  </div>
 );
};

export default Shop;