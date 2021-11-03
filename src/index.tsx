import * as React from 'react';
import styles from 'styles.module.css';

interface Props {
  text: string;
}

export const ExampleComponent = ({ text }: Props): JSX.Element => {
  return <div className={styles.test}>Example Component: {text}</div>;
};
