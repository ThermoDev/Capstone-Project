import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledHeader = styled.h1`
  ${props => console.log(props)};
  color: yellow;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
`;

const Override = props => {
  console.log(props);
  return (
    <div>
      <StyledHeader>hello</StyledHeader>
      <Button color="primary">Override CSS</Button>
      <StyledButton>Other</StyledButton>
    </div>
  );
};

export default Override;
