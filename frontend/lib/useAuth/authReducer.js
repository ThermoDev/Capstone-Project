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
        user,
        expiresAt,
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
    default:
      return state;
  }
};
