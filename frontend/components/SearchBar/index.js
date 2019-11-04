import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper, InputBase, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useApi from '../../lib/useApi';

const InputContainer = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 2px;
`;

const StyledInputBase = styled(InputBase)`
  margin-left: ${({ theme }) => theme.mui.spacing(1)};
  flex: 1;
`;

const SearchBar = props => {
  const { placeholder } = props;
  const [value, setValue] = useState('');
  const { searchStockApi } = useApi();
  const { searchResults, searchStock } = searchStockApi();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const handleInputChange = ({ target }) => setValue(target.value);

  useEffect(() => {
    let active = false;

    if (!loading) {
      return undefined;
    }

    searchStock(value);

    return () => {
      active = false;
    };
  }, []);

  console.log(searchResults);

  return (
    <Autocomplete
      style={{ width: '100%' }}
      onChange={handleInputChange}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      renderInput={params => (
        <InputContainer>
          <StyledInputBase
            {...params}
            fullWidth
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        </InputContainer>
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
