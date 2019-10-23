import React, { Component } from 'react';
import styled from 'styled-components';
// import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import stockMarket from '../images/dashboard-mock-photos/stock-market.png';
// import newsFeed from "../images/dashboard-mock-photos/eg-newsfeed.png";
import watchList from '../images/dashboard-mock-photos/watchlist.png';

// import newsFeedEg from "../images/dashboard-mock-photos/newsfeed-eg.jpeg";
import Iphone from '../images/dashboard-mock-photos/iphone-newsfeed.jpg';
import FB from '../images/dashboard-mock-photos/fb-stock.jpg';

const ColorBox = styled.div`
    background-color: ${props => props.bgColor || 'black'}
    font-family: Montserrat;
    font-weight: bold;
    color: white;
    text-align: center;
    min-height: 5rem;
    padding: 2rem 0;
  `;

class Dashboard extends Component {
  
  
  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ColorBox>
              <p>Portfolio</p>
              <img
                src={stockMarket}
                alt={stockMarket}
                width="100%"
                height="100%"
              />
            </ColorBox>
          </Grid>
          <Grid item xs={9}>
            <ColorBox>
              <p>Newsfeed</p>
              <img src={Iphone} alt={Iphone} width="100%" height="100%" />
            </ColorBox>
          </Grid>
          <Grid item xs={3}>
            <ColorBox>
              <p>Stocks</p>
              <img src={FB} alt={FB} width="100%" height="100%" />
            </ColorBox>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;

