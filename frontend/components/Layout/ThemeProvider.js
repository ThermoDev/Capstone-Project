import React from 'react';
import PropTypes from 'prop-types';
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';

import { theme, muiTheme } from './Themes';

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

const ThemeProvider = props => {
  const { children } = props;
  return (
    <StyledThemeProvider theme={{ ...theme, mui: muiTheme }}>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
      </StylesProvider>
      <GlobalStyle />
    </StyledThemeProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default ThemeProvider;
