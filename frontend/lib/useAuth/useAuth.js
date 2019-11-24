import { useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import { AuthContext } from './AuthProvider';
import { endpoint } from '../../config';

/**
 * Checks if response from server is successful else rejects the promise.
 * @param {Object} response
 */
function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
}

/**
 * useAuth() implements the module design pattern by
 * only exporting public functions used to modify the auth state
 */
export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);

  /**
   * Log the user into the application.
   * @param {string} username
   * @param {string} password
   */
  const login = (username, password) => {
    dispatch({ type: 'startAuthenticating' });
    fetch(`${endpoint}login`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ user_id: username, password }),
    })
      .then(checkStatus)
      .then(result => {
        result.json().then(user => dispatch({ type: 'login', user }));
      })
      .catch(err =>
        err.response.text().then(body => {
          dispatch({ type: 'error', errorType: 'userInfo', error: body });
        })
      )
      .finally(() => {
        dispatch({ type: 'stopAuthenticating' });
      });
  };

  /**
   * Logs the user out of the application.
   */
  const logout = () => {
    dispatch({ type: 'startAuthenticating' });
    fetch(`${endpoint}login/logout`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(checkStatus)
      .then(dispatch({ type: 'logout' }))
      .catch(err =>
        err.response.text().then(body => {
          dispatch({ type: 'error', errorType: 'logoutError', error: body });
        })
      )
      .finally(() => {
        dispatch({ type: 'stopAuthenticating' });
      });
  };

  /**
   * Register a new user.
   * @param {string} email
   * @param {string} firstname
   * @param {string} lastname
   * @param {string} password
   */
  const register = (email, firstname, lastname, password) => {
    dispatch({ type: 'startAuthenticating' });
    fetch(`${endpoint}login/register`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: email,
        first_name: firstname,
        last_name: lastname,
        email,
        password,
      }),
    })
      .then(checkStatus)
      .then(dispatch({ type: 'success' }))
      .catch(err =>
        err.response.text().then(body => {
          dispatch({ type: 'error', errorType: 'regFail', error: body });
        })
      )
      .finally(() => dispatch({ type: 'stopAuthenticating' }));
  };

  /**
   * Check if user is authenticated into the app.
   */
  const isAuthenticated = () =>
    !!(state.expiresAt && new Date().getTime() < state.expiresAt);

  const resetErrors = () => {
    dispatch({ type: 'resetErrors' });
  };

  return {
    isLoading: state.isAuthenticating, // boolean
    isAuthenticated, // function -> boolean
    user: state.user, // object containing user details (username, email etc)
    login, // function
    logout, // function
    register, // function
    resetErrors,
    error: state.error
      ? { message: state.error, errorType: state.errorType }
      : null,
    isError: !!state.error,
    isSuccess: state.success,
  };
};
