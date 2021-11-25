import React from 'react';
import { PlanPicker } from 'octane-components';

interface Props {
  token: string;
}

const App = ({ token }: Props) => {
  return <PlanPicker customerToken={token} />;
};

export default App;
