import React from 'react';
import { Link } from 'react-router';

function StartScreen() {
  return (
    <ul className='mainMenu'>
      <li className='mainMenu--li'>
        <Link className='mainMenu--link' to='/game'>Play</Link>
      </li>
      <li className='mainMenu--li'>
        <Link className='mainMenu--link' to='/'>Load game</Link>
      </li>
      <li className='mainMenu--li'>
        <Link className='mainMenu--link' to='/'>Options</Link>
      </li>
      <li className='mainMenu--li'>
        <Link className='mainMenu--link' to='/'>About</Link>
      </li>
    </ul>
  );
}

StartScreen.propTypes = {
  children: React.PropTypes.node,
};

export default StartScreen;