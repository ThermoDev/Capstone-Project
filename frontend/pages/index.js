import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

const StyledHeader = styled.h1`
  color: ${({ theme }) => theme.grey};
`;

const Index = props => {
  const { shows } = props;
  return (
    <div>
      <StyledHeader>Home</StyledHeader>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            <Link href="/p/[id]" as={`/p/${show.id}`}>
              <a>{show.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();

  return {
    shows: data.map(entry => entry.show),
  };
};

Index.propTypes = {
  shows: PropTypes.array,
};

export default Index;
