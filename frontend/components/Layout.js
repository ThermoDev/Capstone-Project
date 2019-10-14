import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Meta from './Meta';
import Header from './Header';
import theme from './styles/Theme';

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto', sans-serif;
    src: url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'Roboto', sans-serif;
  }
  a {
    text-decoration: none;
    color: ${theme.black}
  }
  button {
    font-family: 'Roboto', sans-serif;
  }
`;

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{children}</Inner>
        </StyledPage>
        <GlobalStyle />
      </ThemeProvider>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
