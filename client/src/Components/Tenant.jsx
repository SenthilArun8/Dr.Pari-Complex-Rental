import { useState } from 'react';
import { FaBuilding, FaDollarSign, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa'; // Importing relevant icons
import { Link } from 'react-router-dom';

// component used for each tenant card

const Tenant = ({ tenant }) => { // Expects a prop called 'tenant'
    // State for showing full description (not directly applicable to the tenant schema,
    // but keeping it as an example if you add a 'notes' or 'description' field later)
    const [showFullDescription, setShowFullDescription] = useState(false);

    const capitalizeWords = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ');
    };

    // This function can be used for any string fields you want to capitalize
    const capitalizeSentence = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (!tenant) {
        return null; // Or a loading message
    }

    // You can decide if you want a description-like field for tenants,
    // otherwise, this part can be removed.
    // For now, I'll comment it out as it doesn't directly map to your schema.
    // let description = tenant.toddler_description;
    // if (!showFullDescription && description.length > 90) {
    //   description = description.substring(0, 90) + '...';
    // }

    // Helper to format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className='bg-white rounded-xl shadow-md relative'>
            <div className='p-4'>
                <div className='mb-6'>
                    <div className='pt-2'></div>
                    <h3 className='text-xl font-bold'>{capitalizeWords(tenant.tenantName)}</h3>
                    <div className='text-gray-600 my-2'>
                        <FaBuilding className='inline text-lg mb-1 mr-1' />
                        Shop: {tenant.shopNumber} ({capitalizeSentence(tenant.shopFacing)}) - Floor {tenant.floorNumber}
                    </div>
                </div>

                {/* Tenant Address */}
                <div className='mb-3 text-emerald-900'>
                    <p>{tenant.tenantAddress}</p>
                </div>

                {/* Contact Information */}
                <div className='mb-4'>
                    <h3 className='text-emerald-700 mb-2'>Contact Info:</h3>
                    <ul className='list-disc pl-5'>
                        <li className='text-emerald-900 mb-1'>
                            <FaPhone className='inline text-sm mr-2' />
                            {tenant.tenantPhoneNumber}
                        </li>
                        {tenant.tenantEmail && (
                            <li className='text-emerald-900 mb-1'>
                                <FaEnvelope className='inline text-sm mr-2' />
                                {tenant.tenantEmail}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Financial Details */}
                <div className='mb-4'>
                    <h3 className='text-emerald-700 mb-2'>Financials:</h3>
                    <ul className='list-disc pl-5'>
                        <li className='text-emerald-900 mb-1'>
                            <FaDollarSign className='inline text-sm mr-2' />
                            Rent: ${tenant.rentAmount} / month
                        </li>
                        <li className='text-emerald-900 mb-1'>
                            <FaCalendarAlt className='inline text-sm mr-2' />
                            Due: Day {tenant.rentalPaymentDate} of each month
                        </li>
                        <li className='text-emerald-900 mb-1'>
                            <FaDollarSign className='inline text-sm mr-2' />
                            Advance Payment: ${tenant.advancePay} ({formatDate(tenant.advancePayDate)})
                        </li>
                    </ul>
                </div>

                <div className='border border-[#d2b48c] mb-5'></div>

                <div className='flex flex-col lg:flex-row justify-between mb-4'>
                    <Link
                        to={`/tenants/${tenant._id}`}
                        className='h-[36px] bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold transition'
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Tenant;