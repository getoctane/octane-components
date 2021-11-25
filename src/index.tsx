import * as React from 'react';

interface Props {
  text: string;
}

export const ExampleComponent = ({ text }: Props): JSX.Element => {
  return <div>Example Component: {text}</div>;
};
