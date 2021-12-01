# octane-components

> Ready-to-use React components that make it easy to integrate with Octane

[![NPM](https://img.shields.io/npm/v/octane-components.svg)](https://www.npmjs.com/package/octane-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Getting started

`octane-components` has a collection of React components and actions (utility methods) to make integrating Octane into your UI simple. It works like this:

1. On your backend, use youer Octane API key to request a customer token.
2. Pass this token to your client-side app and provide it to one of our components.
3. The components handle the rest.

### TL;DR

To demonstrate `octane-components`, we have a fully-functional example app that lives in the `example/` directory. But in short:

```bash
## Install using yarn:
yarn add octane-components

## or NPM:
npm install --save octane-components
```

```tsx
// And then use octane-components in your app.
import React from 'react';

import { PlanPicker, Actions } from 'octane-components';
import 'octane-components/dist/components/globals.css';
import 'octane-components/dist/components/PlanPicker/PlanPicker.css';

// /token is your token endpoint. See "Getting a customer token" below.
fetch('/token')
  .then((resp) => resp.json())
  .then((data) => {
    const { token } = data;
    ReactDOM.render(
      <PlanPicker
        customerToken={token}
        onPlanSelect={(plan) => Actions.subscribeCustomer(token, plan))}
      />,
      document.getElementById('root')
    );
  });
```

### Getting a customer token

A customer token is a short-lived token that allows our components to take action on behalf of a customer. You can fetch one by sending a POST request to the `/ecp/token` endpoint using your Octane API key (more on that [here][api-auth]).

**You should not send your Octane API key to the client**. Your API key can make arbitrary changes to any part of your Octane account and should be kept secret. Instead, you will need to expose a token endpoint that your client-side app can hit in order to fetch a customer token.

Here's an example of what that might look like in a hypothetical Express.js web server:

```js
const axios = require('axios');
const express = require('express');
const app = express();

app.get('/token', (req, res) => {
  // Get the ID of your currently signed-in user.
  const userId = getSignedInUser();
  axios
    .post(
      `https://api.cloud.getoctane.io/ecp/token`,
      {
        customer_name: userId,
      },
      {
        headers: {
          Authorization: `Bearer [YOUR API KEY HERE]`,
        },
      }
    )
    .then((apiRes) => {
      res.json(apiRes.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
      res.send('Something went wrong!');
    });
});

app.listen(3000);
```

## Components

Components are interactive building blocks that handle interacting with specific parts of Octane. Most of them only need a customer token in order to work. By default they are unstyled, although they all include default styles that you can use and customize.

### `PlanPicker`

PlanPicker renders a list of plans available to a customer. If a customer is subscribed to an available plan, that plan is marked as the current subscription. Plans are selectable and fire a callback when they're selected.

```jsx
import { PlanPicker } from 'octane-components';
// CSS variables
import 'octane-components/dist/components/globals.css';
// Default theme
import 'octane-components/dist/components/PlanPicker/PlanPicker.css';

<PlanPicker
  // (Required) Your customer token.
  customerToken={token}
  // (Optional) Callback to fire when a plan is selected.
  onPlanSelect={(planName, plan) => {
    /* callback body */
  }}
/>;
```

![Screenshot of the PlanPicker component](./docs/plan-picker.png)

### `PaymentSubmission`

PaymentSubmission renders a form to accept payment information from a customer. If the customer has payment information on file, the component indicates as much. PaymentSubmission is a wrapper around Stripe's [CardElement component][card-element], but takes care of interacting with Stripe, initializing Stripe's API, and setting up a Stripe payment intent.

```jsx
import { PaymentSubmission } from 'octane-components';
// CSS variables
import 'octane-components/dist/components/globals.css';
// Default theme
import 'octane-components/dist/components/PaymentSubmission/PaymentSubmission.css';

<PaymentSubmission
  // (Required) Your customer token.
  customerToken={token}
  // (Optional) Callback to fire when a payment method is set.
  //   Fires on component init if the customer has payment info on file.
  onPaymentSet={() => {
    /* callback body */
  }}
  // (Optional) The text to show on the "save payment" button. Defaults to "Save"
  saveButtonText={'Save'}
  //
  // The following are props provided by Stripe's CardElement.
  //
  // (Optional) An options object to pass to the underlying CardElement
  //   This can be used to style the CardElement, among other things.
  //   See: https://stripe.com/docs/js/elements_object/create_element?type=card
  options={{}}
  // (Optional) Change event handler to pass to the underlying CardElement
  //   See: https://stripe.com/docs/js/element/events/on_change?type=cardElement
  onChange={(event) => {
    /* callback body */
  }}
  // (Optional) Event handler triggered when the CardElement is fully rendered.
  //   Called with a reference to the underlying Element instance.
  //   See: https://stripe.com/docs/js/element
  onReady={(element) => {
    /* callback body */
  }}
  // (Optional) Triggered whenever the escape key is pressed inside the CardElement.
  onEscape={() => {
    /* callback body */
  }}
/>;
```

![Screenshot of the PlanPicker component](./docs/payment-submission.png)

## Actions

In addition to components, `octane-components` provides access to "actions", or asynchronous interactions with our API. While these complement our React components nicely, they can be used in any client-side app.

### `subscribeCustomer(token, plan, checkForBillingInfo)`

`subscribeCustomer` subscribes a customer to a specific plan. It accepts a the customer token and the name of a plan, and will subscribe that customer to the version of that plan visible to octane-components.

**Example**

```js
import { Actions } from 'octane-components';
const { subscribeCustomer } = Actions;

const planName = 'enterprise_plan';

fetch('/token')
  .then((resp) => resp.json())
  .then((data) => {
    const { token } = data;
    subscribeCustomer(token, planName);
  });
```

**Params**

- `token` _(required, string)_ — A customer token representing the customer you want to subscribe.
- `plan` _(required, string)_ — The name of the plan to subscribe the customer to
- `checkForBillingInfo` _(optional, boolean)_ — Whether or not to verify that there is valid payment information for the customer before subscribing them.

> Note that `checkForBillingInfo` is a convenience check and does not guarantee that valid billing info will be available in the future. For example, a customer could remove their payment information, or their payment details might expire.

## Styling components

By default, components are unstyled. They are decorated with classes that should make it easy to style them to match any sort of branding.

To provide a starting point, each component comes with its own default stylesheet. Each stylesheet depends on CSS variables scoped to the `.octane-component` class. To use a stylesheet, import both the variables and a component's stylesheet wherever you'd like to use them.

```css
/* index.css */

/* variables */
@import 'octane-components/dist/components/globals.css';
/* PlanPicker styles */
@import 'octane-components/dist/components/PlanPicker/PlanPicker.css';
/* PaymentSubmission styles */
@import 'octane-components/dist/components/PaymentSubmission/PaymentSubmission.css';
```

You can tweak our styling without writing new styles from scratch by overwriting our variables:

```css
/* variables */
@import 'octane-components/dist/components/globals.css';

/* overrides */
.octane-component {
  /* Light theme */
  --octane-bg-primary: #d4f5f54d;
  --octane-text-primary: #071420;
  --octane-border-primary: #c7dcd5;
  --octane-text-accent: #128475;
  --octane-bg-secondary: #becbd8;
  --octane-bg-lighter: #484e5980;
  --octane-text-secondary: #282c2c;
  --octane-border-primary: #d4f5f54d;
}

/* PlanPicker styles */
@import 'octane-components/dist/components/PlanPicker/PlanPicker.css';
/* PaymentSubmission styles */
@import 'octane-components/dist/components/PaymentSubmission/PaymentSubmission.css';
```

## Local development

The easiest thing to do is to run `yarn storybook`, which will let you see and edit all of our components.

It can also be useful to develop alongside the example app that lives in `example/`.

Here are the other commands to know about:

```bash
# Run a full build once. This checks types and puts built code in dist/
yarn build
# Start a build server, rebuilding any time a file changes
yarn start
# Run all of our tests
yarn test
# Run the storybook server in development / watch mode
yarn storybook
# Build storybook once
yarn build-storybook
# Fetch our openapi spec and generate fresh TypeScript types
yarn generate
```

## License

MIT © [Octane Software Technology, Inc.](https://getoctane.io)

[api-auth]: https://octane.readme.io/docs/api-authentication
[card-element]: https://stripe.com/docs/payments/integration-builder-card
