const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const rateLimit = require('express-rate-limit');

//a strict limiter for Auth (Login/Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per 'window'
  message: {
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// a general limiter for all other API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    message: "Too many requests, please slow down."
  }
});

//middleware
// 1. DYNAMIC CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',     // local React app 
  'http://localhost:5173',     // Your local React app
  'https://YOUR-FRONTEND-URL.vercel.app' // later update with URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

//existing upload routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

//for user mangement
const userRoutes = require('./routes/UserRouters');
app.use('/api/users', userRoutes);

//test users
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is running and ready for data!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//helment headers
const helmet = require('helmet');
app.use(helmet());