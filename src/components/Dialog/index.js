import React, { Component } from 'react';
// styling
import './style.css';

class Dialog extends Component {
  render() {
    const { text, options, answerCallBack } = this.props;
    return (
      <div className='dialog'>
        <div className='text'>
          { text }
        </div>
        {
          options && options.length > 0 ?
            <div className='answers'>
              {
                options.map((item, index) => <a
                  key={ index }
                  onClick={ () => answerCallBack(item) }>
                  { item.text }
                </a>)
              }
            </div> : ''
        }
      </div>
    );
  };
}

Dialog.propTypes = {
  text: React.PropTypes.string,
  options: React.PropTypes.array,
  answerCallBack: React.PropTypes.func,
};

export default Dialog;