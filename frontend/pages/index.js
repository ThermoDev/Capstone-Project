import Link from 'next/link';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

const StyledHeader = styled.h1`
  color: orangered;
`;

const Index = props => (
  <div>
    <Link href="/user">
      <a>Profile</a>
    </Link>
    <StyledHeader>Batman TV Shows</StyledHeader>
    <ul>
      {props.shows.map(show => (
        <li key={show.id}>
          <Link href="/p/[id]" as={`/p/${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();

  return {
    shows: data.map(entry => entry.show),
  };
};

export default Index;
