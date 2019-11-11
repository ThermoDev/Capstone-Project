import { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dzowh11b5/image/upload/v1565325720/sickfits/t5dehhuwwlcfkpyatfoo.jpg';

const NewsCard = styled(Card)`
  background-color: ${({ theme }) => theme.mui.palette.background.paper};
  box-shadow: ${({ theme }) => theme.mui.shadows[5]};
  width: 100%;
  display: flex;
`;

const NewsItem = props => {
  const { item } = props;
  const { title, urlToImage, description, url } = item;
  return (
    <NewsCard>

      <div style={{ display: 'flex' }}>
        <CardMedia
          title="news image"
          image={urlToImage || DEFAULT_IMAGE}
          style={{ width: '50%' }}
        />
        <CardActionArea onClick={() => window.open(url, '_blank')}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </div>

    </NewsCard>
  );
};

NewsItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    urlToImage: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default memo(NewsItem);
