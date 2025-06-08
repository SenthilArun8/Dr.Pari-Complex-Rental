// src/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import crypto from 'crypto'; // Node.js built-in, no import needed at top-level of this file
import { catchAsync } from '../utils/catchAsync.js'; // For error handling

// Register a new user
export const registerUser = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    console.log(req.body);
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'This email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
});

// Login user
export const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Forgot Password
export const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'No account found with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `<span class="math-inline">\{process\.env\.FRONTEND\_URL\}/reset\-password/</span>{resetToken}`; // Use env var for frontend URL
    await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    });
    res.json({ message: 'Password reset link sent to your email' });
});

// Reset Password
export const resetPassword = catchAsync(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been successfully reset' });
});