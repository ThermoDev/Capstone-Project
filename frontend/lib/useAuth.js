import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

const authContext = createContext();

// TODO: functions will use useDataApi internally for their calls
function useProvideAuth() {
  const [user, setUser] = useState(null); // ! user not persisting between calls

  const signin = (email, password) => {
    // TODO: Implement signin
    // 1. send details to api
    // 2. save user token in browser storage with expiration date
    // 3. set user to user object returned from api response
    // 4. return user object
    localStorage.setItem('token', 12312321321);
    setUser({ username: 'martinle' });
  };

  const signup = (email, password) => {
    // TODO: Implement signup
    // 1. send details to api via post request
    // 2. From api response, set user and user token
    // 3. return user object
    console.log({ email, password });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
    Router.push('/');
  };

  const getUser = token => {
    console.log({ token });
  };

  const sendPasswordResetEmail = email => {
    // TODO: Implement password reset
    console.log('reset password');
  };

  const confirmPasswordReset = (code, password) => {
    // TODO: Implement password reset
    console.log('password reset');
  };

  // Return user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    getUser,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

/* 
    Provider component that wraps the app and makes auth object
    available to any child component that calls useAuth()
*/
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

/*
    Hook for child components to get the auth object (inside the context)
    and re-render tje child components when the value inside the context changes
*/
export const useAuth = () => useContext(authContext);
