import { useState, useEffect, useReducer } from 'react';
import fetch from 'isomorphic-unfetch';
import { endpoint } from '../../config';

const dataFetcher = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

/*
  Args: 
    initialUrl: url of api endpoint
    initialData: the initial state of your data before it calls the api
*/
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(null);
  const [payload, setPayload] = useState(null);

  const [state, dispatch] = useReducer(dataFetcher, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        let result;
        if (payload) {
          result = await fetch(`${endpoint}${url}`, {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
          });
        } else {
          result = await fetch(`${endpoint}${url}`, {
            headers: { 'Access-Control-Allow-Origin': '*' },
            credentials: 'include',
          });
        }
        const data = await result.json();
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl, setPayload]; // return arrray so that user can define their own names for these variables
};

export default useDataApi;
