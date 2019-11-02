export const apiReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT': {
      const { api } = action;
      return {
        ...state,
        [api]: {
          isLoading: true,
          isError: false,
          data: null,
        },
      };
    }
    case 'FETCH_COMPLETE': {
      const { api } = action;
      return {
        ...state,
        [api]: {
          ...state[api],
          isLoading: false,
        },
      };
    }
    case 'ERROR': {
      const { errorType, message, api } = action;
      return {
        ...state,
        [api]: {
          ...state[api],
          isError: true,
          error: { errorType, message },
        },
      };
    }
    case 'SET_DATA': {
      const { data, api } = action;
      return {
        ...state,
        [api]: {
          ...state[api],
          data,
        },
      };
    }
    default:
      return state;
  }
};
