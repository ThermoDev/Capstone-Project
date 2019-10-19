# Examples
from backend.data_pipeline import stockhelper as stkh
import os

def main():
    # Retrieves a single data stock
    stock = stkh.get_data("NFLX", "yahoo")

    # Retrieves a list of stocks
    stocks_0 = stkh.get_all_data(["AAPL", "MSFT"], "yahoo")
    stocks_1 = stkh.get_all_data(["NDAQ", "ABF"], "yahoo")

    # Concatenates lists of lists of stocks of type pd.DataFrame and puts them together into a list of DataFrames
    concatenated_all = stkh.concatenate_all([stocks_0, stocks_1])
    print(concatenated_all[0].head())

    # A list of DataFrames can be connected into a single DataFrame if one would like that
    concatenated = stkh.concatenate(concatenated_all)
    print(concatenated.head())

    # Functions to retrieve some data
    pct_change = stkh.get_pct_change("AAPL", "yahoo")  # Retrieves percent change
    print(f"Percent Change: {pct_change}")
    dol_change = stkh.get_dollar_change("AAPL", "yahoo")  # Retrieves dollar change
    print(f"Dollar Change:{dol_change}")
    ytd = stkh.get_ytd("AAPL", "yahoo")  # Get Year-to-Date return of stock
    print(f"Year-to-Date: {ytd}")

    # More functions, but using yfinance to extract information from the yahoo data source
    ask_price = stkh.get_ask_price("AAPL")  # Get current ask price
    bid_price = stkh.get_bid_price("AAPL")  # Get current bid price
    stkh.get_market_cap("AAPL")  # Get Market Capitalisation
    stkh.get_eps("AAPL")  # Get Earning per Share
    stkh.get_pe_ratio("AAPL")  # Get Price-to-Earnings ratio

    symbols = stkh.get_stock_symbols()
    print(symbols.head())

import json
if __name__ == "__main__":
    main()