# Octane Example App

This app demonstrates how to use Octane components.

## General layout

This app contains two pieces:
1. A web-server that serves static files and fetches customer tokens.
2. A statically-built web app built with Octane components.

The app itself lets you make real requests to Octane on behalf of a user. In order to do this, it needs your Octane API token and the username of the customer account you want to make changes for. Since this app makes real API calls, **it is a good idea to use a test account with this application.**

## Running the app

First, you'll need to create a `.env` file that specifies a few things.
In the root of this app, copy `.env.example` to `.env` and specify the following values:
* `OCTANE_API_KEY`
* `EXAMPLE_USER_ID`

Next, install and run the app:


```sh
# Install dependencies
yarn install

# Build the client-side app
yarn build

# Start the web server
yarn serve
```

By default, the app runs at `http://localhost:3456`.
