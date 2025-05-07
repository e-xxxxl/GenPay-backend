require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route
app.post('/submit-waitlist', async (req, res) => {
  const formData = req.body;

  try {
    const response = await fetch(process.env.GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text(); // Get raw response
    console.log('GAS raw response:', text);

    try {
      const data = JSON.parse(text); // Try parsing
      res.status(200).json({ message: 'Success', data });
    } catch (parseError) {
      console.error('Error parsing GAS response:', parseError);
      res.status(500).json({
        message: 'Failed to parse GAS response',
        raw: text,
      });
    }
  } catch (err) {
    console.error('Error forwarding to GAS:', err);
    res.status(500).json({ message: 'Failed to submit to GAS' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
