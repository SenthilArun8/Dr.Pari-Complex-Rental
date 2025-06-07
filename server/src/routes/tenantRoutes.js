// server/src/routes/tenantRoutes.js
import express from 'express';
// Assuming your tenant-related logic is in a controller file
import {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant
} from '../controllers/tenantController.js'; // You'll create this file

// Assuming you have a middleware to protect routes (e.g., check JWT token)
// This middleware would verify if the user is authenticated and potentially authorized (e.g., admin)
import { protect } from '../middleware/authMiddleware.js'; // You'll create or use an existing authMiddleware

const router = express.Router();

// Apply the protect middleware to all tenant routes
// This ensures only authenticated users can access these routes
router.use(protect); // Or apply it individually to each route below

// Route to create a new tenant
// POST /api/tenants (assuming app.use('/api/tenants', tenantRoutes) in app.js)
router.post('/', createTenant);

// Route to get all tenants
// GET /api/tenants
router.get('/', getAllTenants);

// Route to get a single tenant by ID
// GET /api/tenants/:id
router.get('/:id', getTenantById);

// Route to update a tenant by ID
// PUT /api/tenants/:id
router.put('/:id', updateTenant);

// Route to delete a tenant by ID
// DELETE /api/tenants/:id
router.delete('/:id', deleteTenant);


export default router;