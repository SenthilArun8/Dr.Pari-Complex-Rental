// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js'; // Assuming you create this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('API is running');
});

// Mount API routes
app.use('/api/auth', authRoutes); // e.g., /api/auth/register, /api/auth/login
// app.use('/api/students', studentRoutes); // e.g., /api/students, /api/students/:id
// app.use('/api/ai', aiRoutes); // e.g., /api/ai/generate

// Centralized Error Handling Middleware (must be last middleware)
app.use(errorHandler);

export default app;