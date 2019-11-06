from data_pipeline import stockhelper
import pandas
import numpy
from datetime import datetime


def test_get_data():
    result = stockhelper.get_data(symbol='MSFT')
    assert len(result) > 0


def test_get_non_existing_data():
    result = stockhelper.get_data(symbol='Failure Case')
    assert len(result) == 0


def test_get_list_data():
    results = stockhelper.get_list_data(["MSFT", "AAPL"])
    assert len(results) > 0
    assert type(results) == list


def test_concatenate_all():
    result1 = stockhelper.get_list_data(["AAPL"], "yahoo")
    result2 = stockhelper.get_list_data(["NDAQ"], "yahoo")
    concatenated_all = stockhelper.concatenate_all([result1, result2])
    assert len(concatenated_all) > 0
    assert type(concatenated_all) == list

    # Test Concatenate on concatenated_all function
    concatenated = stockhelper.concatenate(concatenated_all)
    assert len(concatenated) > 0
    assert type(concatenated) == pandas.DataFrame


def test_function_calls():
    # Test functions that calls get_data
    pct_change = stockhelper.get_pct_change("AAPL", "yahoo")  # Retrieves percent change
    assert pct_change is not None
    assert type(pct_change) == numpy.float64

    dol_change = stockhelper.get_dollar_change("AAPL", "yahoo")  # Retrieves dollar change
    assert dol_change is not None
    assert type(dol_change) == numpy.float64

    ytd = stockhelper.get_ytd("AAPL", "yahoo")  # Get Year-to-Date return of stock
    assert ytd is not None
    assert type(ytd) == numpy.float64


def test_read_stocks():
    result = stockhelper.read_stock_data()
    assert len(result) > 0
    assert type(result) == pandas.DataFrame


def test_search():
    result = stockhelper.search_stocks_list("Microsoft")
    assert len(result) > 0
    assert type(result) == pandas.DataFrame


def test_fail_search():
    result = stockhelper.search_stocks_list("TEST SHOULD FAIL")
    assert len(result) == 0
    assert type(result) == pandas.DataFrame


def test_industry():
    result = stockhelper.get_industry("MSFT")
    assert len(result) > 0
    assert type(result) == str


def test_fail_industry():
    result = stockhelper.get_industry("NOT EXISTS")
    assert result is None


def test_info():
    result = stockhelper.get_info("AAPL")
    assert len(result) > 0
    assert type(result) == dict


def test_fail_info():
    result = stockhelper.get_info("NOT EXISTS")
    assert len(result) == 0


def test_get_close_price():
    result = stockhelper.get_cur_close_price("MSFT")
    assert result is not None
    assert type(result) == numpy.float64


def test_fail_get_close_price():
    result = stockhelper.get_cur_close_price("NOT EXISTS")
    assert result is None


def test_stock_symbols():
    result = stockhelper.get_stock_symbols()
    assert len(result) > 0
    assert type(result) == pandas.DataFrame


def test_df_to_dict():
    data = stockhelper.get_data("MSFT")
    results = stockhelper.df_to_dict(data)
    assert len(results) > 0
    assert type(results) == dict


def test_date_validation():
    date1 = datetime(2000, 1, 1).date()
    date2 = datetime(1996, 10, 1).date()
    date1, date2 = str(date1), str(date2)
    results = stockhelper.validate_dates([date1, date2])
    assert results is True
    assert type(results) == bool


def test_fail_date_validation():
    results = stockhelper.validate_dates(["NOT EXISTS"])
    assert results is False
    assert type(results) == bool


def test_random():
    number = 10
    results = stockhelper.get_random(number)
    assert len(results) == number
    assert type(results) == pandas.DataFrame


def test_get_stocks_infos():
    tickers = ["aApL", "MsFt"]
    results = stockhelper.get_stocks_infos(tickers)
    assert results is not None
    assert len(results) == len(tickers) # Will be asserted successfully if tickers are known to exist
