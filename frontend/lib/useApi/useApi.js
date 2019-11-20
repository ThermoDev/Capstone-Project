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

export const useApi = () => {
  const { state, dispatch } = useContext(ApiContext);

  const errorHandler = (err, api) => {
    try {
      err.response.text().then(body => {
        dispatch({
          type: 'ERROR',
          errorType: api,
          error: body,
        });
      });
    } catch {
      dispatch({
        type: 'ERROR',
        api,
        errorType: api,
        message: err.message,
      });
    }
  };

  const callApi = (url, apiName, payload = null) => {
    dispatch({ type: 'FETCH_INIT', api: apiName });
    dataFetcher(url, payload)
      .then(result =>
        result
          .json()
          .then(data => dispatch({ type: 'SET_DATA', api: apiName, data }))
      )
      .catch(err => errorHandler(err, apiName))
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: apiName }));
  };

  const apiPromise = (url, apiName, payload = null) => {
    dispatch({ type: 'FETCH_INIT', api: apiName });
    return dataFetcher(url, payload)
      .then(result =>
        result
          .json()
          .then(data => dispatch({ type: 'SET_DATA', api: apiName, data }))
      )
      .catch(err => errorHandler(err, apiName))
      .finally(() => dispatch({ type: 'FETCH_COMPLETE', api: apiName }));
  };

  // Use this endpoint when you have a component that access a blank api state each time it renders
  const resetApiData = api => dispatch({ type: 'RESET', api });

  const getRandomNews = () => callApi('news/', 'news');

  const getRandomStocks = () => callApi('stock/random/', 'randomStocks');

  const getPortfolios = () => callApi('portfolios', 'portfolios');

  const getGames = () => callApi('games', 'games');

  const getStockHistory = (symbol, startDate, endDate = null) => {
    const url = endDate
      ? `stock/?symbol=${symbol}&start=${startDate}&end=${endDate}`
      : `stock/?symbol=${symbol}&start=${startDate}`;
    callApi(url, 'stockHistory');
  };

  const getYearlyStockHistory = symbol => {
    const lastYear = moment()
      .add(-5, 'year')
      .format('YYYY-MM-DD');
    getStockHistory(symbol, lastYear);
  };

  const createPortfolio = async (portfolioName, startingCash) => {
    await apiPromise('portfolios/create', 'createPort', {
      name: portfolioName,
      cash: startingCash,
    });
    getPortfolios();
  };

  const postProcessTransaction = async (portfolioId, transactionObject) => {
    await apiPromise('portfolios/process-transaction', 'processTransaction', {
      portfolio_id: portfolioId,
      transaction: transactionObject,
    });
    getPortfolios();
  };

  const postCreateGame = async (
    name,
    startDate,
    endDate,
    userNames,
    initialCash
  ) => {
    await apiPromise('games/create', 'createGame', {
      name,
      start_date: startDate,
      end_date: endDate,
      usernames: userNames,
      initial_cash: initialCash,
    });
    getGames();
  };

  const postCheckUser = userId => {
    callApi('login/check-user', 'checkUser', {
      user_id: userId,
    });
  };

  const getStockSymbols = () => callApi('stock/getallsymbols', 'symbols');

  const searchStocks = (query = null) => {
    const url = query ? `stock/search/${query}` : `stock/search/`;
    callApi(url, 'search');
  };

  const getStockInfo = stockTicker =>
    callApi(`stock/infos/${stockTicker}`, 'stockInfo');

  // ! this is a workaround to prevent anything relying on getStockInfo from updating when its called from a different component
  const getStock = stockTicker =>
    callApi(`stock/infos/${stockTicker}`, 'stock');

  return {
    state,
    resetApiData,
    getRandomNews,
    getRandomStocks,
    getPortfolios,
    getYearlyStockHistory,
    createPortfolio,
    postProcessTransaction,
    postCreateGame,
    postCheckUser,
    getStockSymbols,
    searchStocks,
    getStockInfo,
    getStock,
    getGames,
  };
};
