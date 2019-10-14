# Examples
from data_pipeline import stockhelper as stk


def main():
    # Retrieves a single data stock
    stock = stk.get_data("NFLX", "yahoo")

    # Retrieves a list of stocks
    stocks_0 = stk.get_all_data(["AAPL", "MSFT"], "yahoo")
    stocks_1 = stk.get_all_data(["NDAQ", "ABF"], "yahoo")

    # Concatenates lists of lists of stocks of type pd.DataFrame and puts them together into a list of DataFrames
    concatenated_all = stk.concatenate_all([stocks_0, stocks_1])
    print(concatenated_all[0].head())

    # A list of DataFrames can be connected into a single DataFrame if one would like that
    concatenated = stk.concatenate(concatenated_all)
    print(concatenated.head())

    # Functions to retrieve some data
    pct_change = stk.get_pct_change("AAPL", "yahoo")  # Retrieves percent change
    print(f"Percent Change: {pct_change}")
    dol_change = stk.get_dollar_change("AAPL", "yahoo")  # Retrieves dollar change
    print(f"Dollar Change:{dol_change}")
    ytd = stk.get_ytd("AAPL", "yahoo")  # Get Year-to-Date return of stock
    print(f"Year-to-Date: {ytd}")

    # More functions, but using yfinance to extract information from the yahoo data source
    ask_price = stk.get_ask_price("AAPL")  # Get current ask price
    bid_price = stk.get_bid_price("AAPL")  # Get current bid price
    stk.get_market_cap("AAPL")  # Get Market Capitalisation
    stk.get_eps("AAPL")  # Get Earning per Share
    stk.get_pe_ratio("AAPL")  # Get Price-to-Earnings ratio


if __name__ == "__main__":
    main()
