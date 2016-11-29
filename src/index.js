import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store';

// routes and store
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

const initialState = {};
const store = configureStore(initialState, browserHistory);

// Set up the router, wrapping all Routes in the App component
import App from './containers/App';
import createRoutes from './routes';
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={rootRoute} />
  </Provider>,
  document.getElementById('root')
);