// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';
import guestRoutes from './routes/guestRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// API routes
app.use('/api/guests', guestRoutes);