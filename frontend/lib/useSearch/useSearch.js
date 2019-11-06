import { useState, useEffect } from 'react';
import useApi from '../useApi';

// const filterArray = arr => arr.filter((x) => )

export const useSearch = () => {
  const [inputText, setInputText] = useState(null);
  const [results, setResults] = useState([]);
  const { state, searchStocks } = useApi();
  const { search } = state;

  // const searchData = get(search, 'data', []);

  // useEffect(() => {
  //   searchStocks();
  // }, []);

  useEffect(() => {
    const handler = setTimeout(() => searchStocks(inputText), 500);

    return () => clearTimeout(handler);
  }, [inputText]);

  return {
    inputText,
    setInputText,
    state,
  };
};
