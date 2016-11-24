import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import debug from 'debug';
import './index.css';

debug.enable('dev');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
