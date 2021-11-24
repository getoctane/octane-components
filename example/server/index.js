// Imports
require('dotenv').config();
const express = require('express');

// Constants
const app = express();
const port = process.env.PORT ?? 3000;
const octaneKey = process.env.OCTANE_API_KEY;
const userId = process.env.EXAMPLE_USER_ID;

// Make sure our required configurations are set.
if (!octaneKey) {
  throw new Error('The OCTANE_API_KEY environment variable was not set.');
}

if (!userId) {
  throw new Error('The EXAMPLE_USER_ID environment variable was not set.');
}

// A health-checking endpoint never hurts
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Serve anything in the 'public' dir from /public
app.use('public', express.static('public'));

// Get the token for the given user
app.get('/token/:user', (req, res) => {
  // Get the token for the user, given the API key
  res.send(JSON.stringify(req));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
