// ============================================
// VERCEL SERVERLESS EXPRESS APPLICATION
// ============================================
// This file wraps the Express app for Vercel serverless
// All /api/* routes are handled by this single function

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Disable version disclosure
app.disable('x-powered-by');

// MongoDB Connection (Vercel serverless)
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 2, // Limit for serverless
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = true;
        console.log('✅ MongoDB Connected (Serverless)');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        isConnected = false;
        throw error;
    }
}

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Finance Tracker API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes - Import backend routes
// These will be mounted when the function is called
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/transactions', require('../backend/routes/transactions'));
app.use('/api/budget', require('../backend/routes/budget'));
app.use('/api/ai', require('../backend/routes/ai'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// ============================================
// VERCEL SERVERLESS HANDLER
// ============================================
// Pre-connect on module load (cached between requests)
connectDB().catch(err => console.error('Initial DB connection failed:', err));

// Export Express app for Vercel
module.exports = app;
