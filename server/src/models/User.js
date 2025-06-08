import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
        type: String,
        enum: ['user', 'admin'], // Or whatever roles you define
        default: 'user', // Default role for new users
    },
  resetPasswordToken: String, // Stores the unique token for password reset
  resetPasswordExpires: Date  // Stores the expiration timestamp for the token
}, { timestamps: true });

export default mongoose.model('User', userSchema);
