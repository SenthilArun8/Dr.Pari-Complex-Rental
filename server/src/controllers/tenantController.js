// server/src/controllers/tenantController.js
import asyncHandler from 'express-async-handler'; // npm install express-async-handler
import Tenant from '../models/Tenant.js';

// @desc    Create a new tenant
// @route   POST /api/tenants
// @access  Private/Admin
export const createTenant = asyncHandler(async (req, res) => {
  const {
        shopName,
        shopNumber,
        shopFacing,
        floorNumber,
        tenantName,
        tenantAddress,
        tenantPhoneNumber,
        tenantEmail,
        advancePay,
        advancePayDate,
        rentalPaymentDate,
        rentAmount,
        monthlyRentPaidAmount1,
        monthlyRentPaidAmount2,
        monthlyRentPaidDate1,  
        monthlyRentPaidDate2,  
        balanceAmountPending, 
        TNEBNumber,           
        rentIncrementDate     
    } = req.body;

  // Basic validation
  if (!shopName ||
        !shopNumber ||
        !shopFacing ||
        floorNumber === undefined || // Check for undefined as 0 is a valid floor
        !tenantName ||
        !tenantAddress ||
        !tenantPhoneNumber ||
        !advancePay ||
        !advancePayDate ||
        !rentalPaymentDate ||
        !rentAmount
        ) {
    res.status(400);
    throw new Error('Please enter all required tenant fields.');
  }

  // Create tenant in database
  const tenant = await Tenant.create({
      user: req.user._id,
      shopName,
      shopNumber,
      shopFacing,
      floorNumber,
      tenantName,
      tenantAddress,
      tenantPhoneNumber,
      tenantEmail,
      advancePay,
      advancePayDate, // Date string will be parsed by Mongoose
      rentalPaymentDate: Number(rentalPaymentDate), // Ensure number type for schema
      rentAmount: Number(rentAmount), // Assign tenant to the admin user who created it, if applicable
      monthlyRentPaidAmount1: Number(monthlyRentPaidAmount1), // New: Ensure number type
      monthlyRentPaidAmount2: Number(monthlyRentPaidAmount2), // New: Ensure number type
      monthlyRentPaidDate1,                        // New: Date string will be parsed
      monthlyRentPaidDate2,                        // New: Date string will be parsed
      balanceAmountPending: Number(balanceAmountPending), // New: Ensure number type
      TNEBNumber,                                 // New
      rentIncrementDate 
  });

  if (tenant) {
    res.status(201).json(tenant);
  } else {
    res.status(400);
    throw new Error('Invalid tenant data');
  }
});

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private/Admin
export const getAllTenants = asyncHandler(async (req, res) => {
  // Find tenants associated with the current user (admin)
  const tenants = await Tenant.find({ user: req.user._id });
  res.status(200).json(tenants);
});

// @desc    Get single tenant by ID
// @route   GET /api/tenants/:id
// @access  Private/Admin
export const getTenantById = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  console.log(req);

  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }

  // Ensure the tenant belongs to the authenticated user (admin)
  if (tenant.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view this tenant');
  }

  res.status(200).json(tenant);
});

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
// @access  Private/Admin
export const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }

  // Ensure the tenant belongs to the authenticated user (admin)
  if (tenant.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this tenant');
  }

  const updatedTenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true } // Return the updated doc, run schema validators
  );

  res.status(200).json(updatedTenant);
});

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
// @access  Private/Admin
export const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }

  // Ensure the tenant belongs to the authenticated user (admin)
  if (tenant.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this tenant');
  }

  await Tenant.deleteOne({ _id: req.params.id }); // Using deleteOne for Mongoose 6+

  res.status(200).json({ message: 'Tenant removed' });
});