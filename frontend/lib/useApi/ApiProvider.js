import { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { apiReducer } from './apiReducer';

const DEFAULT_STATE = {};

/**
 * ApiContext initialises are Context object with a default state and dispatch function
 * @returns {React Context}
 */
export const ApiContext = createContext({
  state: DEFAULT_STATE,
  dispatch: () => {},
});

/**
 * ApiProvider() returns a react Provider class
 * @param {React node} children
 * @returns {React.Provider}
 */
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
