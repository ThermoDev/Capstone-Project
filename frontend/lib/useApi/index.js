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
      createResponse: state,
      createPortfolio,
    };
  };

  return {
    portfoliosApi,
    portfolioApi,
    createPortfolioApi,
  };
};
