import { createContext, useContext, useState, useEffect } from 'react';
import { CiStethoscope } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import axiosInstance from '../utils/axios';

const Navbar = () => {
 // Removed isDropdownOpen as Popover handles its own open/close state
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [tenants, setTenants] = useState([]);
 const [tenantsLoading, setTenantsLoading] = useState(false);
 const { user, logout } = useUser(); // Get user object from context
 const navigate = useNavigate();

 useEffect(() => {
  const fetchTenants = async () => {
   // Only fetch tenants if user is logged in AND is an admin
   if (!user || user.role !== 'admin') { // Check for admin role here
    setTenants([]); // Clear tenants if not admin
    return;
   }
   setTenantsLoading(true);
   try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/tenants', {
     headers: { Authorization: `Bearer ${token}` }
    });
    setTenants(response.data);
   } catch (error) {
    console.error('Failed to fetch tenants:', error);
    setTenants([]); // Ensure tenants array is empty on error
   } finally {
    setTenantsLoading(false);
   }
  };

  fetchTenants();
 }, [user]); // Re-run when user object changes (e.g., after login/logout)

 const handleLogout = () => {
  logout();
  navigate('/login');
 };

 const linkClass = ({ isActive }) =>
  isActive
   ? 'bg-[#24201D] text-[#FFEDD2] hover:bg-opacity-80 rounded-md px-3 py-2'
   : 'text-[#FFEDD2] hover:bg-[#632024] hover:text-white rounded-md px-3 py-2';

 return (
  <nav className="bg-[#632024] border-b border-[#632024] sticky top-0 z-50 w-full">
   <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="flex h-20 items-center justify-between">
     <div className="flex flex-1 items-center justify-between md:items-stretch md:justify-start w-full">
      <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
       <span className="flex items-center text-[#FFEDD2] text-xl sm:text-2xl font-bold ml-2 whitespace-nowrap">
        <CiStethoscope className="mr-2 text-3xl" />
        Dr. Pari Complex Rentals
       </span>
      </NavLink>
      {/* Hamburger for mobile */}
      <button
       className="sm:hidden ml-auto text-[#FFEDD2] focus:outline-none"
       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
       aria-label="Open menu"
      >
       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
       </svg>
      </button>
      {/* Desktop nav */}
      <div className="hidden sm:flex flex-1 justify-end">
       <ul className="flex flex-row space-x-2 items-center">
        <li>
         <NavLink to="/" className={linkClass}>
          Home
         </NavLink>
        </li>
        <li>
         <NavLink to="/vacant-shops" className={linkClass}>
          Vacant Shops
         </NavLink>
        </li>
        {/* Render admin-specific links only if user is logged in AND is an admin */}
        {user && user.role === 'admin' && (
         <>
          <li>
           <NavLink to="/tenants" className={linkClass}>
            Tenants
           </NavLink>
          </li>
          {/* NEW: Add New... Dropdown for desktop (admin only) */}
          <li className="relative">
           <Popover>
            <PopoverButton className={`${linkClass({ isActive: false })} font-semibold focus:outline-none flex items-center`}>
             Add New...
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
             </svg>
            </PopoverButton>
            <PopoverPanel className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg z-20">
             <div className="py-1">
              <NavLink to="/add-tenant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
               Add Tenant
              </NavLink>
              <NavLink to="/add-tax-form" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
               Add Tax Form
              </NavLink>
              <NavLink to="/add-vacant-shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
               Add Vacant Shop
              </NavLink>
             </div>
            </PopoverPanel>
           </Popover>
          </li>
          {/* END NEW: Add New... Dropdown */}
          <li>
           {/* Original Tax Forms Popover (admin only) */}
           <Popover>
            <PopoverButton className={`${linkClass({isActive: false})} font-semibold focus:outline-none flex items-center`}>
             Tax Forms
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
             </svg>
            </PopoverButton>
            <PopoverPanel className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg z-20">
             <div className="py-1">
              {tenantsLoading ? (
               <div className="px-4 py-2 text-sm text-gray-700">Loading tenants...</div>
              ) : tenants.length === 0 ? (
               <div className="px-4 py-3 bg-yellow-50 text-yellow-800 text-sm">
                Add tax forms to view them here
               </div>
              ) : (
               tenants.map((tenant) => (
                <button
                 key={tenant._id}
                 onClick={() => {
                  navigate(`/tax-forms/${tenant._id}`);
                 }}
                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                 {tenant.name}
                </button>
               ))
              )}
             </div>
            </PopoverPanel>
           </Popover>
          </li>
         </>
        )}

        {/* Always show Login/Logout button, but conditionally */}
        {user ? (
         <li className="relative">
          <Popover>
           <PopoverButton className="text-[#FFEDD2] hover:bg-[#632024] hover:text-white rounded-md px-2 py-2 font-semibold focus:outline-none flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
           </PopoverButton>
           <PopoverPanel anchor="bottom" className="absolute right-0 mt-2 min-w-[8rem] rounded-xl bg-[#632024] shadow-lg divide-y divide-white/10 z-20 flex flex-col items-center">
            <div className="p-2 w-full flex justify-center">
             <button
              onClick={handleLogout}
              className="block w-24 text-center px-2 py-2 rounded-lg font-semibold text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white transition"
             >
              Logout
             </button>
            </div>
           </PopoverPanel>
          </Popover>
         </li>
        ) : (
         <li>
          <NavLink to="/login" className={linkClass}>
           Login
          </NavLink>
         </li>
        )}
       </ul>
      </div>
     </div>
    </div>
    {/* Mobile sidebar */}
    {isMobileMenuOpen && (
     <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
      <div className="w-64 bg-[#632024] h-full shadow-lg p-6 flex flex-col">
       <button
        className="self-end mb-6 text-[#FFEDD2]"
        onClick={() => setIsMobileMenuOpen(false)}
        aria-label="Close menu"
       >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
       </button>
       <ul className="flex flex-col space-y-4">
        <li>
         <NavLink to="/" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
          Home
         </NavLink>
        </li>
        <li>
         <NavLink to="/vacant-shops" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
          Vacant Shops
         </NavLink>
        </li>
        {/* Render admin-specific links only if user is logged in AND is an admin for mobile */}
        {user && user.role === 'admin' && (
         <>
          <li>
           <NavLink to="/tenants" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
            Tenants
           </NavLink>
          </li>
          <li>
           <NavLink to="/add-tenant" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
            Add Tenant
           </NavLink>
          </li>
          <li>
           <NavLink to="/add-tax-form" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
            Add Tax Form
           </NavLink>
          </li>
          <li>
           <NavLink to="/add-vacant-shop" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
            Add Vacant Shop
           </NavLink>
          </li>
          <li className="pl-3 text-[#FFEDD2] font-semibold">Tax Forms for:</li>
          {tenantsLoading ? (
           <li className="pl-6 text-sm text-[#FFEDD2]">Loading tenants...</li>
          ) : tenants.length === 0 ? (
           <li className="pl-6 py-2 text-sm bg-yellow-50/10 text-yellow-200">
            No tenants found.
           </li>
          ) : (
           tenants.map((tenant) => (
            <li key={tenant._id}>
             <button
              onClick={() => {
               navigate(`/tax-forms/${tenant._id}`);
               setIsMobileMenuOpen(false);
              }}
              className="pl-6 w-full text-left text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white py-2 text-sm"
             >
              {tenant.name}
             </button>
            </li>
           ))
          )}
         </>
        )}
        {/* Always show Login/Logout button for mobile */}
        {user ? (
         <li>
          <button
           onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
           className="text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white rounded-md px-3 py-2 w-full text-left"
          >
           Logout
          </button>
         </li>
        ) : (
         <li>
          <NavLink to="/login" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
           Login
          </NavLink>
         </li>
        )}
       </ul>
      </div>
      <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
     </div>
    )}
   </div>
  </nav>
 );
};

export default Navbar;