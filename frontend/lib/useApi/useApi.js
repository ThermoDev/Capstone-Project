import { useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import moment from 'moment';
import { ApiContext } from './ApiProvider';
import { endpoint } from '../../config';

const dataFetcher = (url, payload = null) => {
  const checkStatus = response => {
    if (response.ok) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  };

  const defaultArgs = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (payload) {
    defaultArgs.method = 'POST';
    defaultArgs.body = JSON.stringify(payload);
  }
  return fetch(`${endpoint}${url}`, defaultArgs).then(checkStatus);
};

const useApi = () => {
  const { state, dispatch } = useContext(ApiContext);

  const getRandomNews = () => {
    dispatch({ type: 'FETCH_INIT', api: 'news' });
    dataFetcher('news/')
      .then(result =>
        result
          .json()
          .then(data => dispatch({ type: 'SET_DATA', api: 'news', data }))
      )
      .catch(err =>
        dispatch({
          type: 'ERROR',
          api: 'news',
          errorType: 'news',
          message: err.message,
        })
      )
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: 'news' }));
  };

  const getRandomStocks = () => {
    dispatch({ type: 'FETCH_INIT', api: 'randomStocks' });
    dataFetcher('stock/random/')
      .then(result =>
        result
          .json()
          .then(data =>
            dispatch({ type: 'SET_DATA', api: 'randomStocks', data })
          )
      )
      .catch(err =>
        dispatch({
          type: 'ERROR',
          api: 'randomStocks',
          errorType: 'randomStocks',
          message: err.message,
        })
      )
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: 'randomStocks' }));
  };

  const getPortfolios = () => {
    dispatch({ type: 'FETCH_INIT', api: 'portfolios' });
    dataFetcher('portfolios')
      .then(result =>
        result
          .json()
          .then(data => dispatch({ type: 'SET_DATA', api: 'portfolios', data }))
      )
      .catch(err =>
        dispatch({
          type: 'ERROR',
          api: 'portfolios',
          errorType: 'portfolios',
          message: err.message,
        })
      )
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: 'portfolios' }));
  };

  const getStockHistory = (symbol, startDate, endDate = null) => {
    const url = endDate
      ? `stock/?symbol=${symbol}&start=${startDate}&end=${endDate}`
      : `stock/?symbol=${symbol}&start=${startDate}`;
    dispatch({ type: 'FETCH_INIT', api: 'stockHistory' });
    dataFetcher(url)
      .then(result =>
        result
          .json()
          .then(data =>
            dispatch({ type: 'SET_DATA', api: 'stockHistory', data })
          )
      )
      .catch(err =>
        dispatch({
          type: 'ERROR',
          api: 'stockHistory',
          errorType: 'stockHistory',
          message: err.message,
        })
      )
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: 'stockHistory' }));
  };

  const getYearlyStockHistory = symbol => {
    const lastYear = moment()
      .add(-1, 'year')
      .format('YYYY-MM-DD');
    getStockHistory(symbol, lastYear);
  };

  const createPortfolio = (portfolioName, startingCash) => {
    dispatch({ type: 'FETCH_INIT', api: 'createPortfolio' });
    dataFetcher('portfolios/create', {
      name: portfolioName,
      cash: startingCash,
    })
      .catch(err =>
        err.response.text().then(body => {
          dispatch({
            type: 'error',
            errorType: 'createPortfolio',
            error: body,
          });
        })
      )
      .finally(() => {
        dispatch({ type: 'FETCH_COMPLETE', api: 'createPortfolio' });
      });
    // Update portfolios seen by app
    getPortfolios();
  };

  const searchStocks = (query = null) => {
    const url = query ? `stock/search/${query}` : `stock/search/`;
    dispatch({ type: 'FETCH_INIT', api: 'search' });
    dataFetcher(url)
      .then(result =>
        result
          .json()
          .then(data => dispatch({ type: 'SET_DATA', api: 'search', data }))
      )
      .catch(err =>
        dispatch({
          type: 'ERROR',
          api: 'search',
          errorType: 'search',
          message: err.message,
        })
      )
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: 'search' }));
  };

  return {
    state,
    getRandomNews,
    getRandomStocks,
    getPortfolios,
    getYearlyStockHistory,
    createPortfolio,
    searchStocks,
  };
};

export default useApi;
