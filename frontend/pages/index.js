import { useEffect } from 'react';
import useDataApi from '../lib/useDataApi';
import { useAuth } from '../lib/useAuth';
import { endpoint } from '../config';
import { DefaultError } from '../components/Error';

const Index = () => {
  const [state, setUrl] = useDataApi(endpoint, {
    portfolio: [], // array properties need to be specified in initialState
  });

  const auth = useAuth();

  useEffect(() => {
    setUrl(`${endpoint}`);
  }, []);

  const { isLoading, isError, data } = state;

  return (
    <div>
      {!auth.user ? (
        <button type="button" onClick={() => auth.signin('martin', 'le')}>
          Login
        </button>
      ) : (
        <button type="button" onClick={() => auth.signout()}>
          Logout
        </button>
      )}

      {auth.user ? (
        <div>
          <h3>{auth.user.username}</h3>
          <h3>{auth.user.token}</h3>
        </div>
      ) : (
        <h3>not signed in</h3>
      )}

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
