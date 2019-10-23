import { useState, useEffect, useReducer } from 'react';
import fetch from 'isomorphic-unfetch';
import { endpoint } from '../config';

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

// TODO: hook must check if user token is in browser storage
// TODO: add extra parameter in function called urlPayload and modify the fetch request based on the
// presence of this variable
const useDataApi = (initialUrl, initialData, postPayload = null) => {
  const [url, setUrl] = useState(initialUrl);

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
        if (postPayload) {
          result = await fetch(`${endpoint}${url}`, {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postPayload),
          });
        } else {
          result = await fetch(`${endpoint}${url}`, {
            headers: { 'Access-Control-Allow-Origin': '*' },
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

  return { state, setUrl };
};

export default useDataApi;
