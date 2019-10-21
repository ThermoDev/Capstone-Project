import React from 'react';
import styled from 'styled-components';
import { Container, Grid, useMediaQuery } from '@material-ui/core';
import { Line } from '../components/Graph';

const ColorBox = styled.div`
  background-color: orangered;
  font-family: Montserrat;
  font-weight: bold;
  color: white;
  text-align: center;
  min-height: 5rem;
  padding: 2rem 0;
`;

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  console.log(isSmall);
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={3} direction={isSmall ? 'column' : 'row'}>
          <Grid item xs={12}>
            <Line />
          </Grid>
          <Grid item xs={12} sm={8}>
            <ColorBox>Container</ColorBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores
              enim soluta et deleniti placeat eum, cupiditate similique
              reiciendis explicabo doloribus omnis porro laboriosam, eaque
              molestias. Corporis optio nostrum facere vero?
            </p>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
