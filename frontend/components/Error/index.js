import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { FillSpaceError, LargeImage, Heading, Subheading } from './style';

/*
  A generic error component which will fill the space of any container its placed in.
  It requires a heading and subheading to be used to inform the error about why this error is being shown.

*/

const Error = props => {
  const { img, head, subhead } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <FillSpaceError small={isSmall}>
      <LargeImage
        src={img}
        alt="error doggo"
        small={isSmall}
        role="img"
        aria-label="Doggo"
      />
      <Heading small={isSmall}>{head}</Heading>
      <Subheading small={isSmall}>{subhead}</Subheading>
    </FillSpaceError>
  );
};

Error.propTypes = {
  img: PropTypes.string,
  head: PropTypes.string,
  subhead: PropTypes.string.isRequired,
};

export default Error;
