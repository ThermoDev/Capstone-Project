import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { endpoint } from '../../config';

function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
}

export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);

  const login = (username, password) => {
    dispatch({ type: 'startAuthenticating' });
    fetch(`${endpoint}login`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
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

  const logout = () => {
    dispatch({ type: 'startAuthenticating' });
    dispatch({ type: 'logout' });
    dispatch({ type: 'stopAuthenticating' });
  };

  // TODO: might be conflicts in localStorage if multiple users
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
      .then(result => {
        result.json().then(user => dispatch({ type: 'login', user }));
      })
      .catch(err =>
        err.response.text().then(body => {
          dispatch({ type: 'error', errorType: 'regFail', error: body });
        })
      )
      .finally(() => dispatch({ type: 'stopAuthenticating' }));
  };

  const isAuthenticated = () =>
    !!(state.expiresAt && new Date().getTime() < state.expiresAt);

  return {
    isLoading: state.isAuthenticating, // boolean
    isAuthenticated, // function -> boolean
    user: state.user, // object containing user details (username, email etc)
    login, // function
    logout, // function
    register, // function
    error: state.error
      ? { errMessage: state.error, errorType: state.errorType }
      : null,
    isError: !!state.error,
  };
};
