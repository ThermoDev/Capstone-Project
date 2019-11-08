import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Paper,
  TextField,
  Grid,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import get from 'lodash.get';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';
import useApi from '../../lib/useApi';

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

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
      ...style,
    },
  });
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = smUp ? 36 : 48;

  const outerElementType = React.useMemo(
    () =>
      React.forwardRef((props2, ref2) => (
        <div ref={ref2} {...props2} {...other} />
      )),
    []
  );

  return (
    <div ref={ref}>
      <FixedSizeList
        style={{
          padding: 0,
          height: Math.min(8, itemCount) * itemSize,
          maxHeight: 'auto',
        }}
        itemData={children}
        height={250}
        width="100%"
        outerElementType={outerElementType}
        innerElementType="ul"
        itemSize={itemSize}
        overscanCount={5}
        itemCount={itemCount}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles({
  listbox: {
    '& ul': {
      padding: '0.5rem',
      margin: 0,
    },
  },
});

const SearchBar = props => {
  const classes = useStyles();
  const { placeholder, onSearch } = props;
  const { state, getStockSymbols } = useApi();
  const { symbols } = state;

  const symbolData = get(symbols, 'data', []);

  useEffect(() => {
    if (symbolData.length === 0) {
      getStockSymbols();
    }
  }, []);

  return (
    <Autocomplete
      classes={classes}
      disableListWrap
      style={{ width: '100%' }}
      options={symbolData.map(item => `${item.Ticker} - ${item.Name}`)}
      ListboxComponent={ListboxComponent}
      onChange={e => {
        const selected = e.target.textContent;
        if (selected) {
          onSearch(selected.split(' - ')[0]);
        } else {
          onSearch('');
        }
      }}
      renderInput={params => (
        <InputContainer>
          <StyledInput
            {...params}
            variant="outlined"
            label={placeholder}
            fullWidth
          />
        </InputContainer>
      )}
    />
  );
};

SearchBar.defaultProps = {
  placeholder: 'Search',
  onSearch: () => {},
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchBar;
