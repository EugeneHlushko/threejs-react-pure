import React from 'react';

function NotFound() {
  return (
    <div>Page was not found.</div>
  );
}

NotFound.propTypes = {
  children: React.PropTypes.node,
};

export default NotFound;