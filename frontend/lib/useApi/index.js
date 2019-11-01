import useApi from './useDataApi';

export default () => {
  const portfoliosApi = () => {
    const [portfolios, setUrl] = useApi('portfolios', []);
    const getPortfolios = () => setUrl('portfolios');
    return { portfolios, getPortfolios };
  };

  const portfolioApi = () => {
    const [portfolio, setUrl] = useApi('portfolios', []);
    const getPortfolio = portfolioId =>
      setUrl(`portfolios?portfolio_id=${portfolioId}`);
    return { portfolio, getPortfolio };
  };

  const createPortfolioApi = () => {
    const [state, setUrl, setPayload] = useApi('portfolios', null);
    const createPortfolio = name => {
      setPayload({ name });
      setUrl('portfolios/create');
    };
    return {
      createState: state,
      createPortfolio,
    };
  };

  const processTransactionApi = () => {
    const [state, setUrl, setPayload] = useApi('portfolios', null);
    const processTransaction = (portfolioId, transaction) => {
      setPayload({ portfolio_id: portfolioId, transaction });
      setUrl('portfolios/process-transaction');
    };
    return {
      transactionState: state,
      processTransaction,
    };
  };

  const getStockApi = () => {
    const [state, setUrl] = useApi('stock');
    const getStock = name => {
      setUrl(`stock?symbol=${name}`);
    };
    return {
      stock: state,
      getStock,
    };
  };

  const getMarketPriceApi = () => {
    const [state, setUrl] = useApi('stock/price');
    const getCurrentMarketPrice = symbol => {
      setUrl(`stock/price?symbol=${symbol}`);
    };
    return {
      marketPrice: state,
      getCurrentMarketPrice,
    };
  };

  const getPercentChangeApi = () => {
    const [state, setUrl] = useApi('stock/pctchange');
    const getPercentChange = symbol => {
      setUrl(`stock/pctchange?symbol=${symbol}`);
    };
    return {
      percent: state,
      getPercentChange,
    };
  };

  const getDollarChangeApi = () => {
    const [state, setUrl] = useApi('stock/dollarchange');
    const getDollarChange = symbol => {
      setUrl(`stock/dollarchange?symbol=${symbol}`);
    };
    return {
      dollarChange: state,
      getDollarChange,
    };
  };

  const getYtdApi = () => {
    const [state, setUrl] = useApi('/stock/ytd');
    const getYtd = symbol => {
      setUrl(`/stock/ytd?${symbol}`);
    };
    return {
      ytd: state,
      getYtd,
    };
  };

  const getAllSymbolsApi = () => {
    const [state, setUrl] = useApi('/stock/getallsymbols/');
    const getAllSymbols = () => setUrl('/stock/getallsymbols/');
    return {
      symbols: state,
      getAllSymbols,
    };
  };

  const searchStockApi = () => {
    const [state, setUrl] = useApi('');
    const searchStock = query => {
      setUrl(`stock/search/${query}`);
    };
    return {
      searchResults: state,
      searchStock,
    };
  };

  const infoApi = () => {
    const [state, setUrl] = useApi('stock/info/');
    const getInfo = symbol => {
      setUrl(`stock/info/${symbol}`);
    };
    return {
      info: state,
      getInfo,
    };
  };

  const getIndustryApi = () => {
    const [state, setUrl] = useApi('stock/industry/');
    const getIndustry = symbol => {
      setUrl(`stock/industry/${symbol}`);
    };
    return {
      industry: state,
      getIndustry,
    };
  };

  const getRandomStocksApi = () => {
    const [state, setUrl] = useApi('', []);
    const getRandom = () => setUrl('stock/random/', []);
    return {
      result: state,
      getRandom,
    };
  };

  return {
    portfoliosApi,
    portfolioApi,
    createPortfolioApi,
    processTransactionApi,
    getStockApi,
    getMarketPriceApi,
    getPercentChangeApi,
    getDollarChangeApi,
    getYtdApi,
    getAllSymbolsApi,
    searchStockApi,
    infoApi,
    getIndustryApi,
    getRandomStocksApi,
  };
};
