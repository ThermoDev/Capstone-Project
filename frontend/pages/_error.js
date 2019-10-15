import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '../components/Error';

function Error({ statusCode }) {
  const errMessage = statusCode
    ? `An error ${statusCode} occurred on server`
    : 'An error occurred on client';

  return (
    <div>
      <ErrorMessage
        img="https://res.cloudinary.com/dzowh11b5/image/upload/v1571136274/comp3900/71001170_248544512727444_4239348242610913280_n_rfiygx.jpg"
        head="Howdy pardner, you like you could use a hand."
        subhead={errMessage}
      />
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
  statusCode: PropTypes.number.isRequired,
};

export default Error;
