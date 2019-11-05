import { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { apiReducer } from './apiReducer';

const DEFAULT_STATE = {};

export const ApiContext = createContext({
  state: DEFAULT_STATE,
  dispatch: () => {},
});

export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, DEFAULT_STATE);
  return (
    <ApiContext.Provider value={{ state, dispatch }}>
      {children}
    </ApiContext.Provider>
  );
};

ApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
