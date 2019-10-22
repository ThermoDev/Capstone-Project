import React, { Component } from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const ColorBox = styled.div`
    background-color: ${props => props.bgColor || 'black'}
    font-family: Montserrat;
    font-weight: bold;
    color: white;
    text-align: center;
    min-height: 5rem;
    padding: 2rem 0;
  `;

class Dashboard extends Component {
  
  
  render() {
    return (
      <div>
        <p>hello</p>
        <Container maxWidth="md">
          <ColorBox>Container</ColorBox>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
