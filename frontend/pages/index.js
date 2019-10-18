import { useEffect } from 'react';
import useDataApi from '../lib/useDataApi';
import { endpoint } from '../config';
import { DefaultError } from '../components/Error';

const Index = () => {
  const [state, setUrl] = useDataApi(endpoint, {
    portfolio: [], // array properties need to be specified in initialState
  });

  useEffect(() => {
    setUrl(`${endpoint}`);
  }, []);

  const { isLoading, isError, data } = state;

  return (
    <div>
      {isError && <DefaultError />}
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <ul>
          {data.username && data.password && (
            <li>
              <h3>{`${data.username} (${data.password})`}</h3>
            </li>
          )}
          {data.portfolio.map((item, index) => (
            <li>
              <ul>
                <li key={index}>{item}</li>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;
