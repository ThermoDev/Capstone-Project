from __future__ import print_function
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import requests, logging, itertools
from datetime import datetime, timedelta
from pandas.tseries import offsets
from typing import Generator, List

# Main libraries that retrieve stock data
from pandas_datareader import data as pdr
import yfinance as yf


# Given a stock(ticker) symbol and a data source, retrieves its relevant stock information
# Can also provide addition parameters for start/end date, and an api_key if necessary.
def get_data(symbol: str, source: str, start_date: str = '2000-01-01',
             end_date: str = str(datetime.now().date()), api_key: str = None) -> pd.DataFrame:
    data = pd.DataFrame()
    # Since symbol can be upper or lowercase, conform it to be all upper
    symbol = symbol.upper()

    try:
        # Retrieves the data from pandas_datareader
        data = pdr.DataReader(
            name=symbol,
            data_source=source,
            start=start_date,
            end=end_date,
            api_key=api_key
        )

    except requests.exceptions.ConnectionError:
        logging.exception(f"Could not fetch Data with symbol '{symbol}' on data source '{source}'.")
    except:
        #logging.exception(f"Could not fetch Data with symbol '{symbol}' on data source '{source}'.")
        print((f"Could not fetch Data with symbol '{symbol}' on data source '{source}'."))
        # Returns empty dataframe
        return data

    data.rename(columns={"Adj Close": "Adj_Close"}, inplace=True)
    data.sort_index(inplace=True)

    # Retrieves percent changes
    data["Pct_Change"] = pd.DataFrame.pct_change(data["Close"])
    data["Symbol"] = symbol
    print(f"Successfully fetched: {symbol} from {source}")

    return data


# Function that returns a generator with stock data
def retrieve_stocks(symbols: List, data_source: str, start_date: str = None, end_date: str = None) -> Generator[
    pd.DataFrame, None, None]:
    for symbol in symbols:
        stock = get_data(symbol, data_source)
        if not stock.empty:
            yield stock


# Using the generator function, retrieves a list of stocks given a list of stock symbols, and a single data source
def get_all_data(symbols: List, data_source: str, start_date: str = None, end_date: str = None) -> List[pd.DataFrame]:
    stocks = []
    stocks = list(retrieve_stocks(symbols, data_source, start_date, end_date))
    return stocks


# Concatenate stocks from a list into a single dataframe
# This will be needed if we are to make use of different data sources
def concatenate(stocks: List) -> pd.DataFrame:
    concatenated = pd.concat(stocks)
    concatenated.sort_index(inplace=True)
    return concatenated


# Takes a list of lists of DataFrames, and flattens it to a list of DataFrames
# This will be needed if we are to make use of different data sources
def concatenate_all(all_stocks: List[List[pd.DataFrame]]) -> List:
    return list(itertools.chain.from_iterable(all_stocks))


# Retrieves the latest change in percentage calculated on closing price.
def get_pct_change(symbol: str, data_source: str) -> np.float64:
    today = datetime.now().date()
    from_date = today - timedelta(days=7)

    # Get stock data
    data = get_data(symbol, data_source, start_date=str(from_date))
    # Returns the latest percentage change.
    return round((data["Pct_Change"][-1] * 100), 2)
    # return data


# Retrieves the dollar change between today and the day before.
def get_dollar_change(symbol: str, data_source: str) -> np.float64:
    today = datetime.now().date()
    from_date = today - timedelta(days=7)
    # Get_data
    data = get_data(symbol, data_source, start_date=str(from_date))
    return data["Close"][-1] - data["Close"][-2]


# Retrieves the percentage return for the stock so far this year.
def get_ytd(symbol: str, data_source: str) -> np.float64:
    today = datetime.now().date()
    start_of_year = today - offsets.YearBegin()

    # Get stock data
    data = get_data(symbol, data_source, start_date=start_of_year)

    # Retrieves the start of year stock info and the current day stock info
    first_current = data.iloc[[0, -1]]
    # Takes the percentage change difference from first_current
    temp = pd.DataFrame.pct_change(first_current["Close"])

    # Returns percent change from start of year to present day
    return temp[-1]


# Note: only works on Yahoo data source
# Retrieves the trailing Price-to-Earnings ratio
def get_pe_ratio(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info['trailingPE']


# Note: only works on Yahoo data source
# Retrieves the Earnings Per Share (EPS)
def get_eps(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info["epsTrailingTwelveMonths"]


# Note: only works on Yahoo data source
# Retrieves Market Capitalisation value
def get_market_cap(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info["marketCap"]


# Note: only works on Yahoo data source
# Retrieves the current bid price : Highest price broker is willing to buy stock
def get_bid_price(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info["bid"]


# Note: only works on Yahoo data source
# Retrieves the current ask price : Lowest price broker is willing to sell stock
def get_ask_price(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info["ask"]
