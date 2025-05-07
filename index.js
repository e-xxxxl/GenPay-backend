require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Use axios instead of fetch

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins or specify ['https://gen-pay.vercel.app']
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// For URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
// For JSON data
app.use(bodyParser.json());

// Simple health check route
app.get('/', (req, res) => {
  res.send('Proxy server is running');
});

// POST route
app.post('/submit-waitlist', async (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  try {
    if (!process.env.GAS_URL) {
      throw new Error('GAS_URL environment variable is not set');
    }

    // Forward to Google Apps Script using axios
    const response = await axios.post(process.env.GAS_URL, formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('GAS response status:', response.status);
    console.log('GAS response data:', response.data);

    // Forward the GAS response back to client
    res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      data: response.data
    });
    
  } catch (err) {
    console.error('Error forwarding to GAS:', err.message);
    
    // Send a more detailed error response
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit to Google Apps Script',
      error: err.message,
    
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`GAS_URL configured: ${process.env.GAS_URL ? 'Yes' : 'No'}`);
});