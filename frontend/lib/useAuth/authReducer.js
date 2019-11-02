export const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      const { user } = action;
      const d = new Date();
      const expiresAt = new Date(d.getTime() + 1000 * 60 * 60 * 24 * 365); // 1 year
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (!sessionStorage.getItem('expires_at')) {
          sessionStorage.setItem('expires_at', JSON.stringify(expiresAt));
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
      };
    }
    case 'logout':
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('expires_at');
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
