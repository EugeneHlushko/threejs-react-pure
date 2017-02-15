import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setGamePause } from 'containers/App/actions';

// styling
import './style.css';

function InGameMenu(props) {
  return (
    <div className='overlay'>
      <ul className='mainMenu'>
        <li className='mainMenu--li'>
          <a className='mainMenu--link'
             onClick={ () => props.onSetGamePause(false) } >
            Resume
          </a>
        </li>
        <li className='mainMenu--li'>
          <Link className='mainMenu--link' to='/'>Save game</Link>
        </li>
        <li className='mainMenu--li'>
          <Link className='mainMenu--link' to='/'>Load game</Link>
        </li>
        <li className='mainMenu--li'
            onClick={ () => props.onSetGamePause(false) }>
          <Link className='mainMenu--link' to='/'>Main menu</Link>
        </li>
      </ul>
    </div>
  );
}

InGameMenu.PropTypes = {
  onSetGamePause: React.PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetGamePause: () => dispatch(setGamePause(false)),
  };
}

export default connect(null, mapDispatchToProps)(InGameMenu);