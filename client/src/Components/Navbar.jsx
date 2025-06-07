import { createContext, useContext, useState, useEffect } from 'react';
import { CiStethoscope } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import axiosInstance from '../utils/axios';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tenants, setTenants] = useState([]); // Changed to 'tenants' for consistency
  const [tenantsLoading, setTenantsLoading] = useState(false); // Changed to 'tenantsLoading'
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => { // Changed to 'fetchTenants'
      if (!user) return;
      setTenantsLoading(true); // Changed to 'setTenantsLoading'
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/tenants', { // Assuming your backend endpoint is '/tenants'
          headers: { Authorization: `Bearer ${token}` }
        });
        setTenants(response.data); // Changed to 'setTenants'
      } catch (error) {
        console.error('Failed to fetch tenants:', error); // Changed message
      } finally {
        setTenantsLoading(false); // Changed to 'setTenantsLoading'
      }
    };

    fetchTenants();
  }, [user]);

  const handleLogout = () => {
    logout()
    navigate('/login');
  };

  // --- UPDATED LINK CLASS WITH CUSTOM HEX COLORS ---
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-[#24201D] text-[#FFEDD2] hover:bg-opacity-80 rounded-md px-3 py-2' // Active: bg #6F4D38, text #FFEDD2, slightly transparent on hover
      : 'text-[#FFEDD2] hover:bg-[#632024] hover:text-white rounded-md px-3 py-2'; // Inactive: text #FFEDD2, bg #632024 on hover, white text on hover
  // --- END UPDATED LINK CLASS ---

  return (
    // --- NAV BACKGROUND AND BORDER ---
    <nav className="bg-[#632024] border-b border-[#632024] sticky top-0 z-50 w-full"> {/* Main navbar background */}
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-between md:items-stretch md:justify-start w-full">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
            {/* --- BRAND TEXT --- */}
            {/* Changed 'block' to 'flex items-center' for inline icon and text alignment */}
            <span className="flex items-center text-[#FFEDD2] text-xl sm:text-2xl font-bold ml-2 whitespace-nowrap">
              <CiStethoscope className="mr-2 text-3xl" /> {/* Added class for icon size and margin */}
              Dr. Pari Complex Rentals
            </span>
          </NavLink>
            {/* Hamburger for mobile */}
            <button
              className="sm:hidden ml-auto text-[#FFEDD2] focus:outline-none" // Hamburger icon color
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
                  <NavLink to="/tenants" className={linkClass}> {/* Changed to /tenants */}
                    Tenants
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/add-tenant" className={linkClass}> {/* Changed to /add-tenant */}
                    Add Tenant
                  </NavLink>
                </li>
                {user && (
                  <li className="relative">
                    <Popover>
                      <PopoverButton className={`${linkClass({isActive: false})} font-semibold focus:outline-none flex items-center`}>
                        Saved Activities
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </PopoverButton>
                      {/* Popover Panel for saved activities */}
                      <PopoverPanel className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg z-20"> {/* You might want to adjust these colors too */}
                        <div className="py-1">
                          {tenantsLoading ? ( // Changed to tenantsLoading
                            <div className="px-4 py-2 text-sm text-gray-700">Loading tenants...</div>
                          ) : tenants.length === 0 ? ( // Changed to tenants.length
                            <div className="px-4 py-3 bg-yellow-50 text-yellow-800 text-sm">
                              Add tenants to view their saved activities
                            </div>
                          ) : (
                            tenants.map((tenant) => (
                              <button
                                key={tenant._id}
                                onClick={() => {
                                  navigate(`/saved-activities/${tenant._id}`);
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
                )}
                {user ? (
                  <li className="relative">
                    <Popover>
                      <PopoverButton className="text-[#FFEDD2] hover:bg-[#632024] hover:text-white rounded-md px-2 py-2 font-semibold focus:outline-none flex items-center justify-center"> {/* User icon color */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </PopoverButton>
                      {/* Popover Panel for User/Logout */}
                      <PopoverPanel anchor="bottom" className="absolute right-0 mt-2 min-w-[8rem] rounded-xl bg-[#632024] shadow-lg divide-y divide-white/10 z-20 flex flex-col items-center"> {/* Popover panel background */}
                        <div className="p-2 w-full flex justify-center">
                          <button
                            onClick={handleLogout}
                            className="block w-24 text-center px-2 py-2 rounded-lg font-semibold text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white transition" // Logout button text and hover
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
            {/* --- MOBILE SIDEBAR BACKGROUND --- */}
            <div className="w-64 bg-[#632024] h-full shadow-lg p-6 flex flex-col"> {/* Mobile sidebar background */}
              <button
                className="self-end mb-6 text-[#FFEDD2]" // Close button color
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
                  <NavLink to="/tenants" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}> {/* Changed to /tenants */}
                    Your Tenants
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/add-tenant" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}> {/* Changed to /add-tenant */}
                    Add Tenant
                  </NavLink>
                </li>
                {user && (
                  <>
                    <li className="pl-3 text-[#FFEDD2] font-semibold">Saved Activities:</li> {/* Mobile sidebar header */}
                    {tenantsLoading ? ( // Changed to tenantsLoading
                      <li className="pl-6 text-sm text-[#FFEDD2]">Loading tenants...</li>
                    ) : tenants.length === 0 ? ( // Changed to tenants.length
                      <li className="pl-6 py-2 text-sm bg-yellow-50/10 text-yellow-200"> {/* Consider changing this yellow-ish alert color */}
                        Add tenants to view their saved activities
                      </li>
                    ) : (
                      tenants.map((tenant) => (
                        <li key={tenant._id}>
                          <button
                            onClick={() => {
                              navigate(`/saved-activities/${tenant._id}`);
                              setIsMobileMenuOpen(false);
                            }}
                            className="pl-6 w-full text-left text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white py-2 text-sm" // Mobile tenant link
                          >
                            {tenant.name}
                          </button>
                        </li>
                      ))
                    )}
                  </>
                )}
                {user ? (
                  <li>
                    <button
                      onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); handleLogout(); }}
                      className="text-[#FFEDD2] hover:bg-[#6F4D38] hover:text-white rounded-md px-3 py-2 w-full text-left" // Mobile Logout button
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