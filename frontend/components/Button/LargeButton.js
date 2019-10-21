import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 200px;
  height: 50px;
  font-size: 1.3rem;
  border: 1px solid black;
`;

const LargeButton = forwardRef((props, ref) => {
  const { className, children, ...buttonProps } = props;
  return (
    <StyledButton className={className} ref={ref} {...buttonProps}>
      {children}
    </StyledButton>
  );
});

LargeButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LargeButton;
