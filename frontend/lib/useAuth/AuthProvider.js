import { useState, useEffect, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { authReducer } from './authReducer';

const DEFAULT_STATE = {
  user: {},
  expiresAt: null,
  isAuthenticating: false,
};

export const AuthContext = createContext({
  state: DEFAULT_STATE,
  dispatch: () => {},
});

export const AuthProvider = ({ children }) => {
  // holds authentication state
  const [state, dispatch] = useReducer(authReducer, DEFAULT_STATE);
  const [contextValue, setContextValue] = useState({ state, dispatch });

  // Update context value and trigger re-render
  // This patterns avoids unnecessary deep renders
  // https://reactjs.org/docs/context.html#caveats
  useEffect(() => {
    setContextValue({
      ...contextValue,
      state,
    });
  }, [state]);

  // Verify user is logged-in on AuthProvider mount
  // Avoids storing sensitive data in local storage
  useEffect(() => {
    dispatch({ type: 'startAuthenticating' });
    if (typeof localStorage !== 'undefined') {
      const expiresAt = localStorage.getItem('expires_at');
      const user = JSON.parse(localStorage.getItem('user'));

      if (user && expiresAt) {
        dispatch({ type: 'login', user }); // set state with user
      } else {
        dispatch({
          type: 'error',
          errorType: 'checkSession',
          error: 'No previous session saved',
        });
      }
    }
    dispatch({ type: 'stopAuthenticating' });
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
