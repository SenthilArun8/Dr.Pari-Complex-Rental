import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../utils/axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); // Get the login function from UserContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData); // Log the form data
    try {
      const response = await axiosInstance.post('auth/login', formData);

      // --- CRITICAL DEBUGGING STEP HERE ---
      // This will log the entire data object received from your backend
      console.log('Full Login API Response Data:', response.data); 
      // --- END CRITICAL DEBUGGING STEP ---

      // Ensure response.data.token exists before proceeding
      if (response.data.token) {
        // The 'login' context function expects the user data object and the token.
        // Assuming your backend sends the user object as 'response.data.user'
        // and the token as 'response.data.token'.
        login(response.data.user, response.data.token); 
        
        console.log('Login successful, navigating to /vacant-shops');
        navigate('/vacant-shops'); // Changed to vacant-shops as per your desired flow
      } else {
        // If the backend returns 200 OK but no token, something is wrong with backend response structure
        console.error('Token not found in the response, even though status was 200 OK.');
        setError('Login failed: Invalid server response.');
      }

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message); // Log full error details
      setError(err.response?.data?.message || 'Login failed: An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white isolate px-6 py-12 lg:px-8">
      {/* Blurred background shapes (like Hero) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 mt-24 rotate-[30deg] bg-gradient-to-tr from-emerald-600 via-amber-300 to-emerald-800 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-600 via-amber-300 to-emerald-800 opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
      </div>
      {/* Lower blurred background to fade out below Login, not above */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl h-40 sm:h-72" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-800 via-amber-300/60 to-transparent opacity-40" />
      </div>
      <div className="w-full max-w-md p-8 backdrop-blur-md bg-[#FFEDD2]/80 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-2xl font-bold text-[#162114]">
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#294122]">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-[#162114] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#294122]">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-[#162114] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-[#294122] px-4 py-2 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-[#294122]">
          Registeristration Controlled by Admin{' '}
          <Link to="/register" className="font-semibold hover:underline text-[#294122]">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-[#294122]">
          <Link to="/forgot-password" className="font-semibold hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}