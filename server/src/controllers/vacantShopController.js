import asyncHandler from 'express-async-handler'; // For handling async errors without repetitive try/catch
import VacantShop from '../models/VacantShop.js'; // Your VacantShop Mongoose model

// @desc    Create a new vacant shop
// @route   POST /api/vacant-shops
// @access  Private (e.g., Admin)
// The 'protect' middleware should run before this to ensure req.user is available
export const createVacantShop = asyncHandler(async (req, res) => {
  const { shopNumber, dimensions } = req.body;

  // 1. Basic validation: Check if required fields are provided
  if (!shopNumber || !dimensions) {
    res.status(400); // Bad Request
    throw new Error('Please include both shop number and dimensions.');
  }

  // 2. Check if a shop with this shopNumber already exists
  const existingShop = await VacantShop.findOne({ shopNumber });
  if (existingShop) {
    res.status(400); // Bad Request
    throw new Error(`Shop number '${shopNumber}' already exists.`);
  }

  // 3. Create the new vacant shop in the database
  const vacantShop = await VacantShop.create({
    shopNumber,
    dimensions,
    user: req.user._id, // Assign the shop to the authenticated user (e.g., admin)
  });

  // 4. Respond with the created shop data
  if (vacantShop) {
    res.status(201).json({ // 201 Created
      message: 'Vacant shop created successfully',
      data: vacantShop, // Return the newly created shop object
    });
  } else {
    res.status(400); // Bad Request if creation failed for unknown reason
    throw new Error('Invalid vacant shop data provided.');
  }
});

// @desc    Get all vacant shops
// @route   GET /api/vacant-shops
// @access  Private (e.g., Authenticated Users)
export const getAllVacantShops = asyncHandler(async (req, res) => {
  // 1. Fetch all vacant shops from the database
  // You might want to sort them, e.g., by shopNumber or creation date
  const vacantShops = await VacantShop.find({}).sort({ shopNumber: 1 }); // Sort by shop number ascending

  // 2. Respond with the array of vacant shops
  res.status(200).json({ // 200 OK
    message: 'All vacant shops fetched successfully',
    data: vacantShops, // Crucial: This will be an array, resolving your frontend .map() error
  });
});

// @desc    Get a single vacant shop by ID
// @route   GET /api/vacant-shops/:id
// @access  Private (e.g., Authenticated Users)
export const getVacantShopById = asyncHandler(async (req, res) => {
  // 1. Find the vacant shop by its ID
  const vacantShop = await VacantShop.findById(req.params.id);

  // 2. Check if the shop exists
  if (!vacantShop) {
    res.status(404); // Not Found
    throw new Error('Vacant shop not found.');
  }

  // 3. (Optional) Authorization check: Ensure user owns or has access to this shop
  // If you only want the user who created it to view it:
  // if (vacantShop.user.toString() !== req.user._id.toString()) {
  //   res.status(401); // Unauthorized
  //   throw new Error('Not authorized to view this vacant shop.');
  // }

  // 4. Respond with the found shop data
  res.status(200).json({ // 200 OK
    message: `Vacant shop ${req.params.id} fetched successfully`,
    data: vacantShop, // Return the single shop object
  });
});

// @desc    Update a vacant shop by ID
// @route   PUT /api/vacant-shops/:id
// @access  Private (e.g., Admin)
export const updateVacantShop = asyncHandler(async (req, res) => {
  const { shopNumber, dimensions } = req.body;

  // 1. Find the vacant shop by its ID
  let vacantShop = await VacantShop.findById(req.params.id);

  // 2. Check if the shop exists
  if (!vacantShop) {
    res.status(404); // Not Found
    throw new Error('Vacant shop not found.');
  }

  // 3. Authorization check: Ensure user has permission to update this shop
  // This typically means the user is an admin or the user who created it.
  // Example for creator:
  // if (vacantShop.user.toString() !== req.user._id.toString()) {
  //   res.status(401); // Unauthorized
  //   throw new Error('Not authorized to update this vacant shop.');
  // }
  // Example for admin: (You'd typically have a `authorize(['admin'])` middleware for this route)

  // 4. Update the shop fields
  vacantShop.shopNumber = shopNumber || vacantShop.shopNumber; // Only update if new value provided
  vacantShop.dimensions = dimensions || vacantShop.dimensions; // Only update if new value provided
  // Add other fields from your schema if you expand it (e.g., imageUrl, description)
  // vacantShop.imageUrl = req.body.imageUrl || vacantShop.imageUrl;

  // 5. Save the updated shop
  const updatedVacantShop = await vacantShop.save();

  // 6. Respond with the updated shop data
  res.status(200).json({ // 200 OK
    message: `Vacant shop ${req.params.id} updated successfully`,
    data: updatedVacantShop, // Return the updated shop object
  });
});

// @desc    Delete a vacant shop by ID
// @route   DELETE /api/vacant-shops/:id
// @access  Private (e.g., Admin)
export const deleteVacantShop = asyncHandler(async (req, res) => {
  // 1. Find the vacant shop by its ID
  const vacantShop = await VacantShop.findById(req.params.id);

  // 2. Check if the shop exists
  if (!vacantShop) {
    res.status(404); // Not Found
    throw new Error('Vacant shop not found.');
  }

  // 3. Authorization check: Ensure user has permission to delete this shop
  // This typically means the user is an admin or the user who created it.
  // Example for creator:
  // if (vacantShop.user.toString() !== req.user._id.toString()) {
  //   res.status(401); // Unauthorized
  //   throw new Error('Not authorized to delete this vacant shop.');
  // }
  // Example for admin: (You'd typically have a `authorize(['admin'])` middleware for this route)

  // 4. Delete the shop
  await vacantShop.deleteOne(); // Mongoose 6+ uses deleteOne()

  // 5. Respond with success message
  res.status(200).json({ // 200 OK
    message: 'Vacant shop removed successfully',
    id: req.params.id, // Optionally return the ID of the deleted shop
  });
});