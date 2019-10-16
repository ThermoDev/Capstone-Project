import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Meta from './Meta';
import Header from './Header';
import ThemeProvider from './ThemeProvider';

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider>
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
