from __future__ import print_function

import os
from datetime import datetime, timedelta
from typing import Generator, List
import itertools
import logging
import json
import numpy as np
import pandas as pd
import requests
from pandas.tseries import offsets

# Main libraries that retrieve stock data
from pandas_datareader import data as pdr
import yfinance as yf

data_path = "data_pipeline/data"
stocks_path = "data_pipeline/data/stocks.csv"
industries_path = "data_pipeline/data/industries.csv"
stocks_and_industries_path = "data_pipeline/data/stocks_and_industries.csv"


def get_data(symbol: str, source: str = "yahoo", start_date: str = '2000-01-01',
             end_date: str = str(datetime.now().date()), api_key: str = None) -> pd.DataFrame:
    """
    Given a stock(ticker) symbol and a data source, retrieves its relevant stock information
    Can also provide additional parameters for start/end date, as well as an api_key if necessary.

    Parameters
    ----------
    symbol : str
        The ticker or stock symbol to retrieve ytd from
    source : str, optional
        The data source to retrieve from (default is "Yahoo")
    start_date : str, optional
        The data source to retrieve from (default is "2000-01-01")
    end_date : str, optional
        The data source to retrieve from (default is Today)
    api_key : str, optional
        Optional API_KEY if the data source requires it

    Returns
    -------
    pandas.DataFrame
        A Pandas DataFrame that returns stock data if fetched
    """

    data = pd.DataFrame()  # Initialize Empty DataFrame
    symbol = symbol.upper()  # Conform Stock Symbols (Tickers) to be all upper case

    start_date = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    end_date = datetime.strptime(end_date, "%Y-%m-%d") if end_date else None

    try:
        data = pdr.DataReader(
            name=symbol,
            data_source=source,
            start=start_date,
            end=end_date,
            api_key=api_key  # Ignore warning, can fix later if we are using os.get_env(api_key)
        )

    except requests.exceptions.ConnectionError:
        print("This may be trying too make too API calls too quickly, might need to wait and try again.")
        logging.exception(f"Could not fetch Data with symbol '{symbol}' on data source '{source}'.")
        return data
    except Exception as e:
        print(e)
        logging.exception(f"Could not fetch Data with symbol '{symbol}' on data source '{source}'.")
        return data

    data.rename(columns={"Adj Close": "Adj_Close"}, inplace=True)  # Remove spaces from column name
    data.sort_index(inplace=True)  # Sorts by index

    # Calculate percent changes
    data["Pct_Change"] = pd.DataFrame.pct_change(data["Close"])
    # Set symbol for identification of records
    data["Symbol"] = symbol

    print(f"Successfully fetched: {symbol} from {source}")

    return data


def retrieve_stocks(symbols: List, data_source: str = "yahoo", start_date: str = None, end_date: str = None,
                    api_key: str = None) -> Generator[pd.DataFrame, None, None]:
    """
    Function that returns a generator with relevant stock data using symbols as a list

    Returns
    -------
    Generator
        returns a generator yielding all stocks from the list of symbols
    """
    for symbol in symbols:
        stock = get_data(symbol, data_source, start_date, end_date, api_key)
        if not stock.empty:
            yield stock


def get_list_data(symbols: List, data_source: str = "yahoo", start_date: str = None,
                  end_date: str = None, api_key: str = None) -> List[pd.DataFrame]:
    """
    Using the generator function, retrieves a list of stocks given a list of stock symbols, and a single data source

    Returns
    -------
    List[pandas.DataFrame]
        A list where each element contains a DataFrame of records for a particular stock
    """
    stocks = list(retrieve_stocks(symbols, data_source, start_date, end_date, api_key))
    return stocks


def concatenate(stocks: List) -> pd.DataFrame:
    """
     Concatenate a list of DataFrame into a singular DataFrame object
     This will be needed if we are to make use of different data sources

    Parameters
    ----------
    stocks : List
        The list of stocks to concatenate

     Returns
     -------
     pandas.DataFrame
         A Pandas DataFrame that returns concatenated DataFrame
     """
    concatenated = pd.concat(stocks)
    concatenated.sort_index(inplace=True)
    return concatenated


def concatenate_all(all_stocks: List[List[pd.DataFrame]]) -> List:
    """
    Takes a list of lists of DataFrames, and flattens it to a list of DataFrames
    This will be needed if we are to make use of different data sources

    Parameters
        all_stocks: List[List[pd.DataFrame]]
    Returns
        List
    """
    return list(itertools.chain.from_iterable(all_stocks))


def get_pct_change(symbol: str, data_source: str = "yahoo", api_key: str = None) -> np.float64:
    """
    Retrieves the latest change in percentage calculated on closing price.

    Parameters
        symbol: str
        data_source: str
        api_key: str

    Returns
    -------
    numpy.float64
        Returns the latest percentage change as a float as a percentage.
    """
    today = datetime.now().date()
    from_date = today - timedelta(days=7)  # Restrict number of values retrieved

    # Get stock data
    data = get_data(symbol, data_source, start_date=str(from_date), end_date=str(today), api_key=api_key)

    try:
        # Returns the latest percentage change.
        return round((data["Pct_Change"][-1] * 100), 2)
    except (IndexError, KeyError):
        pass


# Retrieves the dollar change between today and the day before.
def get_dollar_change(symbol: str, data_source: str = "yahoo", api_key: str = None) -> np.float64:
    """
    Retrieves the current dollar change between today and the day before for a particular stock

    Parameters
    ----------
    symbol : str
        The ticker or stock symbol to retrieve ytd from
    data_source : str, optional
        The data source to retrieve from (default is "Yahoo")
    api_key : str, optional
        Optional API_KEY if the data source requires it


    Returns
    -------
    numpy.float64
        The dollar change that was calculated
    """
    today = datetime.now().date()
    from_date = today - timedelta(days=7)  # Restrict number of values retrieved

    # Get data
    data = get_data(symbol, data_source, start_date=str(from_date), end_date=str(today), api_key=api_key)
    try:
        return data["Close"][-1] - data["Close"][-2]
    except (IndexError, KeyError):
        pass


# Retrieves the percentage return for the stock so far this year.
def get_ytd(symbol: str, data_source: str = "yahoo", api_key: str = None) -> np.float64:
    """
    Retrieves the Year To Date percentage return for a particular stock

    Parameters
    ----------
    symbol: str
    data_source: str, optional
    api_key: str, optional

    Returns
    -------
    numpy.float64
        Returns the ytd obtained from parameters
    """
    today = datetime.now().date()
    start_of_year = today - offsets.YearBegin()
    start_date = datetime.date(start_of_year)

    # Get stock data
    data = get_data(symbol, data_source, start_date=str(start_date), end_date=str(today), api_key=api_key)

    try:
        # Retrieves the start of year stock info and the current day stock info
        first_current = data.iloc[[0, -1]]
        # Takes the percentage change difference from first_current
        temp = pd.DataFrame.pct_change(first_current["Close"])

        # Returns percent change from start of year to present day
        return temp[-1]
    except (IndexError, KeyError):
        pass


def save(data: pd.DataFrame, path: str):
    """
    Retrieves the Year To Date percentage return for a particular stock

    Parameters
    ----------
    data: pandas.DataFrame
        A pandas DataFrame that will be saved as a csv file
    path: str, optional
        The path to save the DataFrame
    """
    if not os.path.exists(data_path):
        os.makedirs(data_path)

    data.to_csv(path, index=False)


def read_stock_data() -> pd.DataFrame:
    """
    A simple function to retrieve the stock data

    Returns
    -------
    pandas.DataFrame
        A Pandas DataFrame that stock data
    """
    try:
        data = pd.read_csv(stocks_path)
    except FileNotFoundError:
        data = pdr.get_nasdaq_symbols()
        save(data, stocks_path)

    return data


def search_stocks_list(search: str) -> pd.DataFrame:
    """
    A search function that return a pandas.DataFrame that matches the search parameter

    Parameters
    ----------
    search : str
        A string that represents the search term to searches through the nasdaq symbols DataFrame for matching strings

    Returns
    -------
    pandas.DataFrame
        A Pandas DataFrame that returns matched search term
    """
    data = read_stock_data()  # Retrieve all stock symbols
    data = add_industries(data)  # Add industry info

    data["Industry"] = data["Industry"].astype(str)  # Force pandas to recognize Industry as str
    string_mask = (data.applymap(type) == str).all()  # Ensure we only look at String values
    string_data = data[data.columns[string_mask]]  # Retrieves the columns that were Strings using the mask

    # Retrieves a search mask of True and False records that locates where a string contains the search term
    # Creates a Series of data for each column of data, and return True if search term exists.
    # Then column stacks the list of series
    search_mask = np.column_stack(
        [string_data[col].str.contains(f"{search}", case=False, na=False) for col in string_data]
    )

    # Returns searched records from the mask
    results = data.loc[search_mask.any(axis=1)]

    results.drop(columns=["CQS Symbol", "NextShares"])
    return results


def get_industry(symbol: str) -> str:
    """
    Retrieves industry name if it exists.

    Parameters
    ----------
    symbol : str
        The ticker or stock symbol to retrieve the industry from

    Returns
    -------
    str
        A string that returns industry. Nothing returned if string is invalid
    """
    data = read_stock_data()  # Retrieve all stock symbols
    data = add_industries(data)  # Add industry info
    symbol = symbol.upper()
    try:
        industry = str(data[data["Ticker"] == symbol].iloc[0]["Industry"])
        if not (industry == " " or industry == "nan"):
            return industry
        pass
    except (IndexError, KeyError):
        pass


# Note: only works on Yahoo data source
def get_info(symbol: str) -> dict:
    """
    Retrieves all known current info about a particular stock

    Parameters
    ----------
    symbol : str
        The ticker or stock symbol to retrieve info from

    Returns
    -------
    dict
        A Dictionary that contains all known information about a stock
    """
    return yf.Ticker(symbol).info


# Note: only works on Yahoo data source
# Retrieves the trailing Price-to-Earnings ratio
def get_pe_ratio(symbol: str) -> np.float64:
    return yf.Ticker(symbol).info['trailingPE']


# Note: only works on Yahoo data source
# Retrieves current close price given a symbol
def get_cur_close_price(symbol: str) -> np.float64:
    try:
        ticker = yf.Ticker(symbol)
        price = ticker.history(period="min")["Close"][-1]
        return price
    except KeyError:
        print("Try retrieving from DataFrame instead")
        today = datetime.now().date()
        from_date = today - timedelta(days=2)  # Restrict number of values retrieved

        # Get stock data
        data = get_data(symbol, start_date=str(from_date))

        try:
            # Returns the latest percentage change.
            return data["Close"][-1]
        except (IndexError, KeyError):
            pass


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


def get_stock_symbols() -> pd.DataFrame:
    """
    Retrieves all stock symbols available from the NASDAQ data market
    Information on symbols can be retrieved here: http://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs

    Returns
    -------
    pandas.DataFrame
        A Pandas DataFrame with data available from the NASDAQ market
    """
    # data = pdr.get_nasdaq_symbols()
    data = read_stock_data()

    # CLean up Data
    data = data[data["Nasdaq Traded"]]
    # Drops irrelevant columns
    data.drop(["Nasdaq Traded", "Market Category", "NextShares", "CQS Symbol", "Financial Status", "Round Lot Size",
               "Test Issue"], axis=1,
              inplace=True, errors="ignore")

    return data


def df_to_list(data: pd.DataFrame, orient: str = "columns") -> list:
    """
    Given a DataFrame, converts it to list format using json.loads so we can apply jsonify()

    Parameters
    ----------
    data : pandas.DataFrame
        A DataFrame containing Stocks
    orient: str
        Specifies the orientation used by to_json() method
        Orient in {'split','records','index','columns','values','table'}

    Returns
    -------
    list
        Converted list from json.loads()
    """
    orient = orient.lower()
    json_data = data.to_json(orient=orient)
    loads_data = json.loads(json_data)
    return loads_data


def validate_dates(dates: list) -> bool:
    """
    Simply validates the dates to ensure they are able to used by pandas.data_reader

    Parameters
    ----------
    dates : list[str]
        A list of dates in str format.

    Returns
    -------
    bool
        Returns True if successfully validated.
    """
    try:
        for date in dates:
            datetime.strptime(date, "%Y-%m-%d") if date else None
        return True
    except ValueError:
        return False


def get_industry_data() -> pd.DataFrame:
    """
    Retrieves stocks industry data in a usable format

    Returns
    -------
    DataFrame
         A DataFrame containing all stock symbols, along with their industries
    """
    # URL where data is kept
    stocks_url = "http://rankandfiled.com/static/export/cik_ticker.csv"
    industries_url = "http://rankandfiled.com/static/export/sic_naics.csv"

    # Reads in data
    stocks = pd.read_csv(stocks_url, sep="|")
    industries = pd.read_csv(industries_url, sep="|")

    # Drop irrelevant value
    industries.drop(columns=["NAICS", "NAICS_Descrip"], inplace=True)
    stocks.drop(
        columns=["Exchange", "CIK", "Business", "Incorporated", "IRS"],
        inplace=True)

    # Use -1 as placeholder
    stocks["SIC"].fillna(-1, inplace=True)

    # Convert to int, so when stringed, will only be integers
    stocks["SIC"] = stocks["SIC"].astype(int)
    industries["SIC"] = industries["SIC"].astype(int)

    # Strings those SIC values
    stocks["SIC"] = stocks["SIC"].astype(str)
    industries["SIC"] = industries["SIC"].astype(str)

    # Drops Duplicates of SIC found in industries data
    industries.drop_duplicates(subset="SIC", inplace=True)

    # Removes Brackets found in Description to generalize industries better
    industries["SIC_Descrip"] = industries["SIC_Descrip"].str.replace(r"\s+\(.*\)", "")

    # Merges the records on the SIC
    merged = pd.merge(stocks, industries, how="left", on="SIC")

    merged["SIC_Descrip"].fillna(method='ffill', inplace=True)
    merged["SIC_Descrip"].fillna(method='bfill', inplace=True)

    # Drops the duplicates, and clean up data
    merged.drop_duplicates(subset="Ticker", inplace=True)
    merged.drop(columns=["SIC"], inplace=True)
    merged.rename(columns={"SIC_Descrip": "Industry"}, inplace=True)

    # Saves the file
    save(merged, industries_path)

    return merged


def add_industries(data: pd.DataFrame) -> pd.DataFrame:
    """
    Given a DataFrame, returns another DataFrame containing industries

    Parameters
    ----------
    data : DataFrame
        A DataFrame containing all stock symbols, without industries

    Returns
    -------
    DataFrame
         A DataFrame containing all stock symbols, with industries
    """
    try:
        industries = pd.read_csv(industries_path)
    except FileNotFoundError:
        industries = get_industry_data()

    data_copy = data.copy()
    industries_copy = industries.copy()

    merged = pd.merge(data_copy, industries_copy, how="inner", left_on="NASDAQ Symbol", right_on="Ticker")

    merged.drop(columns="NASDAQ Symbol", inplace=True, errors="ignore")
    merged.dropna(subset=["Ticker"], inplace=True)  # Drops unknown Ticker values

    save(merged, stocks_and_industries_path)

    return merged


# Simple function to just get every piece of data available for stocks
def get_all_stock_data() -> pd.DataFrame:
    data = get_stock_symbols()
    data = add_industries(data)
    return data


def __add_stock_info(data: pd.DataFrame) -> pd.DataFrame:
    spaced_list = " ".join(list(data["Ticker"].values))  # Retrieve space-seperated ticker values

    tickers = yf.Tickers(spaced_list)
    ticky = tickers.download()

    price = ticky["Close"]
    price = price.iloc[-1]
    price = pd.DataFrame(price)
    price.columns = ["Price"]
    data = data.merge(price, left_on="Ticker", right_index=True)

    price = ticky["Close"]
    pct_change = price.pct_change()  # Calculate pct_change
    pct_change = pct_change.iloc[-1]  # Retrieve last row
    pct_change = pct_change * 100
    pct_change = pd.DataFrame(pct_change)
    pct_change.columns = ["PCT Change"]
    pct_change["PCT Change"] = pct_change["PCT Change"].astype(float)
    data = data.merge(pct_change, left_on="Ticker", right_index=True)

    data["Is_Up"] = data["PCT Change"] > 0

    infos = [ticker.info for ticker in tickers.tickers]
    info_df = pd.DataFrame(infos)

    info_df = info_df[[
        "epsTrailingTwelveMonths",
        "marketCap",
        "trailingPE",
        "bid",
        "ask",
    ]]

    temp = data.copy()
    # Need to reset index for whatever reason (Something to do with index persisting in memory)
    temp = temp.reset_index()
    data = pd.concat([temp, info_df], axis=1)

    data.rename(columns={
        "epsTrailingTwelveMonths": "Earnings per Share",
        "marketCap": "Market Capitalization",
        "trailingPE": "Price to Earnings",
        "bid": "Bid",
        "ask": "Ask"
    }, inplace=True)

    return data


def get_random(number: int = 10) -> pd.DataFrame:
    data = get_all_stock_data()
    random_data = data.sample(n=number)
    random_data = __add_stock_info(random_data)
    return random_data
