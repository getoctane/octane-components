// Imports
require('dotenv').config();
const express = require('express');
const axios = require('axios');

// Constants
const app = express();
const port = process.env.PORT ?? 3456;
const octaneKey = process.env.OCTANE_API_KEY;
const userId = process.env.EXAMPLE_USER_ID;
const octaneHost =
  process.env.OCTANE_API_HOST ?? 'https://api.cloud.getoctane.io';
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${octaneKey}`,
  },
};

console.log(`
╭――――――――――――――――――――――――――――――――――――╮
│                                    │
│ Starting the Octane Example Server │
│                                    │
╰――――――――――――――――――――――――――――――――――――╯

Environment:
   - port: ${port}                  
   - user ID: ${userId}             
   - Octane host: ${octaneHost}     
`);

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

// Get the token for the given user
app.get('/token', (req, res) => {
  // Get the token for the user, given the API key
  axios
    .post(
      `${octaneHost}/ecp/token`,
      {
        customer_name: userId,
      },
      axiosConfig
    )
    .then((apiRes) => {
      res.json(apiRes.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      res.send('Something went wrong fetching a token for the current user.');
    });
});

// Serve anything in the 'public' dir from /
app.use(express.static('public'));

// Serve anything in the 'dist' dir from /dist
app.use('/dist', express.static('dist'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
