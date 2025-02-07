import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';

export const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  turquoise: '#00ced1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  font: {
    sm: '0.7rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  },
};

export const muiTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: '#00ced1',
      },
      secondary: {
        main: '#dddddd',
      },
      error: pink,
    },
    overrides: {
      MuiAutocomplete: {
        popup: { zIndex: 1300 },
      },
    },
  })
);
