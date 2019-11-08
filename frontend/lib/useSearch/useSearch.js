import { useState, useEffect } from 'react';
import get from 'lodash.get';
import useApi from '../useApi';

const filterArray = (arr, substring) => {
  if (!substring) return [];
  return arr.filter(
    item =>
      item.Name.toLowerCase().includes(substring) ||
      item.Ticker.toLowerCase().includes(substring)
  );
};

export const useSearch = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const { state, getStockSymbols } = useApi();
  const { symbols } = state;

  const symbolData = get(symbols, 'data', []);

  useEffect(() => {
    if (symbolData.length === 0) {
      getStockSymbols();
    }
  }, []);

  useEffect(() => {
    const handler =
      inputText.length >= 2
        ? setTimeout(() => setResults(filterArray(symbolData, inputText)), 800)
        : null;

    return () => handler && clearTimeout(handler);
  }, [inputText]);

  return {
    inputText,
    setInputText,
    results: symbolData,
  };
};
