import React from 'react';
import PropTypes from 'prop-types';

export interface Props {
  customerToken: string;
}

export default function PricePlans({ customerToken }: Props): JSX.Element {
  return <div>Token: {customerToken}</div>;
}

PricePlans.propTypes = {
  customerToken: PropTypes.string,
};
