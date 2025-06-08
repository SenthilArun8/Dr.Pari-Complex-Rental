// server/src/routes/vacantShopRoute.js
import express from 'express';
// Assuming your vacant shop-related logic is in a controller file
import {
  createVacantShop,
  getAllVacantShops,
  getVacantShopById,
  updateVacantShop,
  deleteVacantShop
} from '../controllers/vacantShopController.js';

// Now importing the renamed 'authorize'
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', getAllVacantShops);
router.get('/:id', getVacantShopById);

// --- PROTECTED ADMIN ROUTES ---
// Using the new 'authorize' middleware with the 'admin' role
router.post('/', protect, authorize(['admin']), createVacantShop);
router.put('/:id', protect, authorize(['admin']), updateVacantShop);
router.delete('/:id', protect, authorize(['admin']), deleteVacantShop);

export default router;  