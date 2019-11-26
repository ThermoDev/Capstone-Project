import { useContext } from 'react';
import fetch from 'isomorphic-unfetch';
import moment from 'moment';
import { ApiContext } from './ApiProvider';
import { endpoint } from '../../config';

/**
 * dataFetcher() makes a HTTP request to a url.
 * @param {string} url - API endpoint url
 * @param {Object|null} payload - object to post to api
 * @returns {Promise}
 */
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

/**
 * useApi() implements the module design pattern by
 * only exporting public functions used to modify a shared state
 */
export const useApi = () => {
  const { state, dispatch } = useContext(ApiContext);

  /**
   * errorHandler() abstracts away error handling logic and
   * automatically handles different cases for the user
   * @param {Object} err
   * @param {string} api
   */
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

  /**
   * Generic function used to call an API endpoint and save that data to the state
   * @param {string} url
   * @param {string} apiName
   * @param {Object} payload
   */
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

  /**
   * Generic function used to call an API endpoint and save the response data to the state
   * Unlike callApi(), this function returns a Promise.
   * @param {string} url
   * @param {string} apiName
   * @param {Object} payload
   * @returns {Promise}
   */
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

  /**
   * Calls the "news" api to retrieve random news articles.
   */
  const getRandomNews = () => callApi('news/', 'news');

  /**
   * Calls the the "random" api to get a random list of 10 stocks.
   */
  const getRandomStocks = () => callApi('stock/random/', 'randomStocks');

  /**
   * Retrieves portfolio information for current logged in user.
   */
  const getPortfolios = () => callApi('portfolios', 'portfolios');

  /**
   * Retrieves all game information for current logged in user.
   */
  const getGames = () => callApi('games', 'games');

  /**
   * Retrieve stock history for a particular stock between a certain timeframe
   * @param {string} symbol - stock ticker
   * @param {string} startDate - the date in DD/MM/YYYY format
   * @param {string} endDate - the date in DD/MM/YYYY format
   */
  const getStockHistory = (symbol, startDate, endDate = null) => {
    const url = endDate
      ? `stock/?symbol=${symbol}&start=${startDate}&end=${endDate}`
      : `stock/?symbol=${symbol}&start=${startDate}`;
    callApi(url, 'stockHistory');
  };

  /**
   * Retrieve a stocks pricing history from the last 5 years.
   * @param {string} symbol - stock ticker
   */
  const getYearlyStockHistory = symbol => {
    const lastYear = moment()
      .add(-5, 'year')
      .format('YYYY-MM-DD');
    getStockHistory(symbol, lastYear);
  };

  /**
   * Create a new portfolio and update portfolio state
   * @param {string} portfolioName
   * @param {int} startingCash
   */
  const createPortfolio = async (portfolioName, startingCash) => {
    await apiPromise('portfolios/create', 'createPort', {
      name: portfolioName,
      cash: startingCash,
    });
    getPortfolios();
  };

  /**
   * Buy/Sell a stock for a portfolio.
   * @param {string} portfolioId
   * @param {Object} transactionObject
   * @callback callback - callback to immediately invoke upon completion of transaction promise
   */
  const postProcessTransaction = async (
    portfolioId,
    transactionObject,
    callback = getPortfolios
  ) => {
    await apiPromise('portfolios/process-transaction', 'processTransaction', {
      portfolio_id: portfolioId,
      transaction: transactionObject,
    });
    callback();
    // getGames();
  };

  /**
   * Create a new game.
   * @param {string} name
   * @param {string} startDate
   * @param {string} endDate
   * @param {string} userNames
   * @param {number} initialCash
   */
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

  /**
   * Check if a username is valid.
   * @param {string} userId
   */
  const postCheckUser = userId => {
    callApi('login/check-user', 'checkUser', {
      user_id: userId,
    });
  };

  /**
   * Retrieves all stock symbols from database.
   */
  const getStockSymbols = () => callApi('stock/getallsymbols', 'symbols');

  /**
   * Retrieve general information about a stock.
   * @param {string} query
   */
  const searchStocks = (query = null) => {
    const url = query ? `stock/search/${query}` : `stock/search/`;
    callApi(url, 'search');
  };

  /**
   * Retrieve up-to-date stock info from api.
   * @param {string} stockTicker
   */
  const getStockInfo = stockTicker =>
    callApi(`stock/infos/${stockTicker}`, 'stockInfo');

  /**
   * this is a workaround to prevent anything relying on getStockInfo from updating when its called from a different component
   */
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
