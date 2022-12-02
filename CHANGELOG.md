# Change Log

All notable changes will be documented in this file.
NPM Publish adheres to [Semantic Versioning](http://semver.org/).

## [v0.6.1](https://github.com/getoctane/octane-components/commit/804b4e9e37b58a7ad3a885ecb55348c4936bf0b8)

**Fixes**

- Fixed a bug where package versions were published prematurely

## [v0.6.0](https://github.com/getoctane/octane-components/commit/18bd3414f2c3468d1e3ddf2bcfbd92045c48b987)

**Features**

- Added a `useUpdateContactInfo` hook

## [v0.5.0](https://github.com/getoctane/octane-components/commit/58fe02b8c047b4a7b52fbb7e2117620798bcc608)

**Features**

- Added `useInvoices` and `useContactInfo` hooks and actions.

**Improvements**

- Updated types for the `useActiveSubscription` hook.

## [v0.4.0](https://github.com/getoctane/octane-components/commit/9825057bcd28a092ef8623ef86242216da909476)

**BREAKING**

- `octane-components` now builds separate CommonJS and ESModule builds. This may impact import paths in your project, particularly if you were importing non-top-level exports in this package. If your build system is happy with this change, you're likely fine, but feel free to get in touch with us by opening a GitHub issue if you encounter upgrade problems.

**Features**

- Add React hooks for all of our current actions.

## [v0.3.0](https://github.com/getoctane/octane-components/commit/f12e4eebf3443eb963cadd55a0fcfae57bfd1ab8)

**Features**

- Pre-built components all include an `onError` prop which accepts a callback for handling errors.

**Improvements**

- Currencies now support fractional cents up to 12 digits long.
- Expose `hasPaymentInfo` and `getActiveSubscriptions` through the named `Actions` export.

## [v0.2.0](https://github.com/getoctane/octane-components/commit/c7ccc0b5b7d61f94706a812b3b324811e173d6a8) (2021-12-06)

**Features**

- Added `hasPaymentInfo` and `getActiveSubscription` actions.
- Added a `StripeElements` component to make using other Stripe components easier.
- Updated the docs.

**Improvements**

- Set up a Github workflow to auto-publish updates to NPM when the package.json version updates.
- Remove unused package-lock.json.
- Updated dependencies.

## [v0.1.1](https://github.com/getoctane/octane-components/commit/7c5b64b4bc2ccfd61fe089f2c14531cd02c2416a) (2021-12-01)

**Improvements**

- Minor cleanup to the example app

**Fixes**

- Updated imports to be relative, which should allow types to work properly.

## [v0.1.0](https://github.com/getoctane/octane-components/commit/dd543b6ccbb888a018c1f86777213e625cdfe4a1) (2021-12-01)

- Initial release (!!)
