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
  const { state, searchStocks } = useApi();
  const { search } = state;

  const searchData = get(search, 'data', []);

  useEffect(() => {
    if (searchData.length === 0) {
      searchStocks();
    }
  }, []);

  useEffect(() => {
    const handler =
      inputText.length >= 2
        ? setTimeout(() => setResults(filterArray(searchData, inputText)), 800)
        : null;

    return () => handler && clearTimeout(handler);
  }, [inputText]);

  console.log(results);

  return {
    inputText,
    setInputText,
    results,
  };
};
