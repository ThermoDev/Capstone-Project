import React from 'react';
import PropTypes from 'prop-types';
import errorImage from '../static/404.jpg';

function Error({ statusCode }) {
  const errMessage = statusCode
    ? `An error ${statusCode} occurred on server`
    : 'An error occurred on client';

  return (
    <div>
      <h1>Howdy pardner, you like you could use a hand.</h1>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  let statusCode;
  if (res) {
    statusCode = res.statusCode;
  } else {
    statusCode = err ? err.statusCode : 404;
  }
  return { statusCode };
};

Error.propTypes = {
  statusCode: PropTypes.string.isRequired,
};

export default Error;
