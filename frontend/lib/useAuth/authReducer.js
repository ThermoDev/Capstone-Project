/**
 * Reducer function that is used to modify state for Authentication
 * @param {string} state - initial state
 * @param {string} action - operation to perform on state
 */
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      const { user } = action;
      const d = new Date();
      const expiresAt = new Date(d.getTime() + 1000 * 60 * 60 * 24 * 365); // 1 year
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        if (!localStorage.getItem('expires_at')) {
          localStorage.setItem('expires_at', JSON.stringify(expiresAt));
        }
      }
      return {
        ...state,
        user: {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userId: user.user_id,
        },
        expiresAt,
        success: false,
      };
    }
    case 'logout':
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('expires_at');
      }
      return {
        ...state,
        user: {},
        expiresAt: null,
      };
    case 'stopAuthenticating':
      return {
        ...state,
        isAuthenticating: false,
      };
    case 'startAuthenticating':
      return {
        ...state,
        isAuthenticating: true,
      };
    case 'success':
      return {
        ...state,
        success: 'true',
      };
    case 'error': {
      const { errorType, error } = action;
      return {
        ...state,
        user: {},
        expiresAt: null,
        errorType,
        error: error.response
          ? `${error.response.status} ${error.response.statusText}`
          : error,
      };
    }
    case 'resetErrors':
      delete state.errorType;
      delete state.error;
      return {
        ...state,
      };
    default:
      return state;
  }
};
