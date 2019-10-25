import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorStyles = styled.div`
  font-size: 1rem;
  padding: 1rem;
  background: white;
  margin: 1rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const InlineError = ({ error }) => {
  if (!error || !error.message) return null;
  return (
    <ErrorStyles>
      <p>
        <strong>Shoot!</strong>
        {error.message.replace('with id', '')}
      </p>
    </ErrorStyles>
  );
};

InlineError.propTypes = {
  error: PropTypes.shape({
    error: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
};

export default InlineError;
