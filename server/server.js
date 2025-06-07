// server.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config(); // Load environment variables first

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});