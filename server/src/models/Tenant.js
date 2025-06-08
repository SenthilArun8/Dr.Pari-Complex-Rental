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
    shopName: {
      type: String,
      required: [true, 'Please specify shop Name (e.g. The Coffee Bean)'],
      trim: true,
    },
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
    monthlyRentPaidAmount1: {
      type: Number,
      required: [true, 'Please enter the monthly rent paid amount'],
      min: 0,
      default: 0, // Default to 0 if not provided
    },
    monthlyRentPaidAmount2: {
      type: Number,
      required: [true, 'Please enter the monthly rent paid amount'],
      min: 0,
      default: 0, // Default to 0 if not provided
    },
    monthlyRentPaidDate1: {
      type: Date,
      // Not required initially if no payment has been made yet
    },
    monthlyRentPaidDate2: {
      type: Date,
      // Not required initially if no payment has been made yet
    },
    balanceAmountPending: {
      type: Number,
      required: false, // This will be calculated on the frontend, so not strictly required by the schema on creation
      default: 0, // Default to 0
    },

    // --- Additional Information ---
    TNEBNumber: { // Tamil Nadu Electricity Board (TNEB) customer number
      type: String,
      trim: true,
      // Add a regex for TNEB number format if there's a specific pattern
    },
    rentIncrementDate: { // Auto-calculated based on advancePayDate
      type: Date,
      // Not strictly required as it's derived, but good to store
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  });

export default mongoose.model('Tenant', tenantSchema);
