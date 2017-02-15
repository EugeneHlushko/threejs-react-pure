import React from 'react';
import Loader from 'components/Loader';

import { selectGameLoading } from './selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// styling
import './style.css';

function App(props) {
  return (
    <div className='container'>
      { props.gameLoading ? <Loader /> : '' }
      { React.Children.toArray(props.children) }
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
  gameLoading: React.PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  gameLoading: selectGameLoading(),
});

export default connect(mapStateToProps)(App);