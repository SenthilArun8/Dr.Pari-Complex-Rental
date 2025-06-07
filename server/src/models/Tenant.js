import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema( {
    // Link to the Admin User who manages this tenant record
    // This is crucial for multi-user admin dashboards to filter tenants by admin.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Refers to your User model (assuming it's named 'User')
    },

    // --- Shop Details ---
    shopNumber: {
      type: String,
      required: [true, 'Please add a shop number'],
      trim: true,
      unique: true, // Assuming shop numbers should be unique
    },
    shopFacing: {
      type: String,
      required: [true, 'Please specify shop facing (e.g., East, West, Road-facing)'],
      trim: true,
    },
    floorNumber: {
      type: Number,
      required: [true, 'Please add the floor number'],
      min: -1, // Assuming floor numbers can be 0 (ground floor) or positive
    },

    // --- Tenant Personal Information ---
    tenantName: {
      type: String,
      required: [true, 'Please add the tenant name'],
      trim: true,
    },
    tenantAddress: {
      type: String,
      required: [true, 'Please add the tenant address'],
      trim: true,
    },
    tenantPhoneNumber: {
      type: String,
      required: [true, 'Please add the tenant phone number'],
      trim: true,
      // add a regex for phone number format validation here
    },
    tenantEmail: {
      type: String,
      trim: true,
      lowercase: true, // Storing emails in lowercase for consistency
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email regex validation
    },

    // --- Financial Details ---
    advancePay: { // Initial advance payment/security deposit
      type: Number,
      required: [true, 'Please add the advance payment amount'],
      min: 0,
    },
    // The date the initial advance payment was received (equivalent to deposit date)
    advancePayDate: { // Renamed from 'deposit date' for clarity with 'advancePay'
      type: Date,
      required: [true, 'Please add the advance payment date'],
    },
    rentalPaymentDate: { // The date the rent is due each month (e.g., 1st, 5th, 10th)
      type: Number, // Storing as a number (day of the month)
      required: [true, 'Please add the monthly rental payment due date'],
      min: 1,
      max: 31,
    },
    rentAmount: {
      type: Number,
      required: [true, 'Please add the monthly rent amount'],
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  });

export default mongoose.model('Tenant', tenantSchema);
