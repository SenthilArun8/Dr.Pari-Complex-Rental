import { useState, useEffect } from 'react';
import Tenant from '../Components/Tenant'; // Assuming Tenant.jsx is in the same directory
import axiosInstance from '../utils/axios'; // For fetching data from your API

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint for fetching tenants
        const response = await axiosInstance.get('/tenants');
        setTenants(response.data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-emerald-700 py-8">Loading tenants...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 py-8">{error}</div>;
  }

  if (tenants.length === 0) {
    return <div className="text-center text-xl text-gray-600 py-8">No tenants found.</div>;
  }

  return (
    <section className='bg-emerald-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-emerald-700 mb-6 text-center'>
          Our Tenants
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {tenants.map((tenant) => (
            <Tenant key={tenant._id} tenant={tenant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TenantsPage;