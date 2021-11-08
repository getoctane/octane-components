# octane-components

> Ready-to-use React components that make it easy to integrate with Octane

[![NPM](https://img.shields.io/npm/v/octane-components.svg)](https://www.npmjs.com/package/octane-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
## For yarn:
yarn add octane-components

## For NPM:
npm install --save octane-components
```

## Usage

```tsx
import React, { Component } from 'react';

import MyComponent from 'octane-components';
import 'octane-components/dist/index.css';

class Example extends Component {
  render() {
    return <MyComponent />;
  }
}
```

## Local Development

The easiest thing to do is to run `yarn storybook`, which will let you see and edit all of our components.

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
