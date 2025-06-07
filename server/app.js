// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import tenantRoutes from './src/routes/tenantRoutes.js'; 
import { errorHandler } from './src/middleware/errorHandler.js'; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('API is running');
});

// Mount API routes
app.use('/auth', authRoutes); // e.g., /api/auth/register, /api/auth/login
app.use('/tenants', tenantRoutes); // <--- Mount tenant routes here (e.g., /tenants)
// app.use('/api/ai', aiRoutes); // e.g., /api/ai/generate

// Centralized Error Handling Middleware (must be last middleware)
app.use(errorHandler);

export default app;