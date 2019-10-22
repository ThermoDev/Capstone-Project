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

  const  login = async (username, password) => {
    var success = false;
    dispatch({ type: 'startAuthenticating' });
    await fetch(`${endpoint}login`, {
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

        success = true;
      })
      .catch(err =>
        err.response
          .text()
          .then(body =>{
            dispatch({ type: 'error', errorType: 'userInfo', error: body });
          })
      )
      .finally(() =>{ 
        dispatch({ type: 'stopAuthenticating' })
      });
      return success;
  };

  const logout = () => {
    dispatch({ type: 'startAuthenticating' });
    dispatch({ type: 'logout' });
    dispatch({ type: 'stopAuthenticating' });
  };

  // TODO: might be conflicts in localStorage if multiple users
  const register = async (email, firstname, lastname, password) => {
    var success = false;
    dispatch({ type: 'startAuthenticating' });
    await fetch(`${endpoint}login/register`, {
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
        success = true;
      })
      .catch(err =>
        err.response
          .text()
          .then(body =>{
            dispatch({ type: 'error', errorType: 'regFail', error: body });
          })
      )
      .finally(() => dispatch({ type: 'stopAuthenticating' }));
    return success;
  };

  const isAuthenticated = () =>
    !!(state.expiresAt && new Date().getTime() < state.expiresAt);

  return {
    isLoading: state.isAuthenticating,
    isAuthenticated,
    user: state.user,
    login,
    logout,
    register,
    error: state.error
      ? { error: state.error, errorType: state.errorType }
      : null,
  };
};
