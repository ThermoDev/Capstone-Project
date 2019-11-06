import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper, TextField, Grid, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useSearch from '../../lib/useSearch';

const InputContainer = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 2px;
`;

const StyledInput = styled(TextField)`
  margin-left: ${({ theme }) => theme.mui.spacing(1)};
  flex: 1;
`;

const SearchBar = props => {
  const { placeholder } = props;
  const { setInputText, results } = useSearch();

  const handleInput = ({ target }) => setInputText(target.value);

  return (
    <Autocomplete
      style={{ width: '100%' }}
      options={results}
      getOptionLabel={x => x.Ticker}
      autoComplete
      includeInputInList
      freeSolo
      disableOpenOnFocus
      renderInput={params => (
        <InputContainer>
          <StyledInput
            {...params}
            placeholder={placeholder}
            fullWidth
            onInput={handleInput}
          />
        </InputContainer>
      )}
      renderOption={option => (
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h6">{option.Ticker}</Typography>
            <Typography variant="body2" color="textSecondary">
              {option.Name}
            </Typography>
          </Grid>
        </Grid>
      )}
    />
  );
};

SearchBar.defaultProps = {
  placeholder: 'Search',
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

export default SearchBar;
