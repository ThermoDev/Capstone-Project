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

  return {
    portfoliosApi,
    portfolioApi,
    createPortfolioApi,
    processTransactionApi,
  };
};
