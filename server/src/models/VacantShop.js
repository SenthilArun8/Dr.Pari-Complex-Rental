import mongoose from 'mongoose';

const vacantShopSchema = new mongoose.Schema({
  // Unique identifier for the shop unit
  shopNumber: {
    type: String,
    required: [true, 'Shop number is required'],
    unique: true, // Ensures each shop number is unique
    trim: true // Removes whitespace from both ends of a string
  },
  // Physical dimensions of the shop
  dimensions: {
    type: String,
    required: [true, 'Dimensions are required'],
    trim: true
  },
  // Reference to the User who added this vacant shop
  // This helps track who manages or added which shops.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true
  }
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

export default mongoose.model('VacantShop', vacantShopSchema);