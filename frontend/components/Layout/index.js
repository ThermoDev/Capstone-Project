import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';
import Meta from './Meta';
import Header from './Header';
import ThemeProvider from './ThemeProvider';
import { useAuth } from '../../lib/useAuth';

// Progress Bar
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const UnauthenticatedPage = styled.div`
  color: ${props => props.theme.black};
  height: 100vh;
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const UnauthenticatedGlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.mui.palette.primary.main};;
  }
`;

// TODO: if on pages which require authentication but user does not have authenticaton
// TODO: send to home page
const Layout = props => {
  const { children } = props;
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      {isAuthenticated() ? (
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{children}</Inner>
        </StyledPage>
      ) : (
        <>
          <UnauthenticatedPage>
            <Meta />
            <Inner>{children}</Inner>
          </UnauthenticatedPage>
          <UnauthenticatedGlobalStyle />
        </>
      )}
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
