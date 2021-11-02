import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

fetch('/token')
  .then((resp) => resp.json())
  .then((data) => {
    const { token } = data;
    ReactDOM.render(<App token={token} />, document.getElementById('root'));
  });
