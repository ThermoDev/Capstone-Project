from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify, Response
)
# IMPORT FUNCTIONS HERE
from backend.data_pipeline import stockhelper as stkh

bp = Blueprint('stock', __name__, url_prefix='/stock')

quandl_api_key = "JFyyk4MvK4j83jschxUi"


# Docs: https://docs.google.com/document/d/1R1z88DVgySPoQ_UNPwn9ulASJtNr0T6grSgKmDcSGxU/edit?usp=sharing

# Index route to retrieve history of a particular stock
@bp.route('/', methods=['GET'])
def index():
    # Example: /stock/?symbol=MSFT&source=yahoo
    symbol = request.args.get("symbol")
    source = request.args.get("source", default="yahoo")

    # Handle Required Parameter
    if not symbol:
        return Response("Please provide a symbol parameter to API call", status=400)

    print(f"Source: {source}, Symbol: {symbol}")

    # Optional start and end dates.
    start_date = request.args.get("start", default="2000-01-01")
    end_date = request.args.get("end", default=None)

    if not stkh.validate_dates([start_date, end_date]):
        return Response("Please provide dates in the format of 'YYYY-MM-DD'. ", status=400)

    # Optional if the data source requires an API key
    api_key = request.args.get("api_key")

    data = stkh.get_data(symbol=symbol, source=source, start_date=start_date, end_date=end_date, api_key=api_key)
    list_data = stkh.df_to_dict(data, orient="index")

    if not list_data:
        return Response("Data not found...", status=404)
    return jsonify(list_data)


# Retrieve Current Close Price
@bp.route('/price/<symbol>', methods=['GET'])
def price(symbol: str):
    try:
        data = stkh.get_cur_close_price(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves the latest percentage change
@bp.route('/pctchange/', methods=['GET'])
def pctchange():
    symbol = request.args.get("symbol")
    source = request.args.get("source", default="yahoo")
    api_key = request.args.get("api_key", default=None)

    # Handle Required Parameter
    if not symbol:
        return Response("Please provide a symbol parameter to API call", status=400)

    data = stkh.get_pct_change(symbol, source, api_key)

    if not data:
        return Response("Data not found...", status=404)

    return Response(str(data))


# Retrieves the dollar change from today and yesterday
@bp.route('/dollarchange/', methods=['GET'])
def dollarchange():
    symbol = request.args.get("symbol")
    source = request.args.get("source", default="yahoo")
    api_key = request.args.get("api_key", default=None)

    # Handle Required Parameter
    if not symbol:
        return Response("Please provide a symbol parameter to API call", status=400)

    data = stkh.get_dollar_change(symbol, source, api_key)

    if not data:
        return Response("Data not found...", status=404)

    return Response(str(data))


# Retrieves Year-to-Date return for a stock
@bp.route('/ytd/', methods=['GET'])
def ytd():
    symbol = request.args.get("symbol")
    source = request.args.get("source", default="yahoo")
    api_key = request.args.get("api_key", default=None)

    # Handle Required Parameter
    if not symbol:
        return Response("Please provide a symbol parameter to API call", status=400)

    data = stkh.get_ytd(symbol, source, api_key)

    if not data:
        return Response("Data not found...", status=404)

    return Response(str(data))


# Retrieves all symbols from Nasdaq
@bp.route('/getallsymbols', methods=['GET'])
def get_all_symbols():
    data = stkh.get_all_stock_data()

    list_data = stkh.df_to_dict(data, orient="records")
    return jsonify(list_data)


@bp.route('/search/', methods=['GET'])
def search_all():
    data = stkh.search_stocks_list("")
    list_data = stkh.df_to_dict(data, orient="records")
    return jsonify(list_data)


@bp.route('/search/<search_term>', methods=['GET'])
def search_string(search_term: str):
    data = stkh.search_stocks_list(search_term)
    list_data = stkh.df_to_dict(data, orient="records")

    if not list_data:
        return Response(f"Could not find anything with the search term: {search_term}.", status=404)
    return jsonify(list_data)


# -- YAHOO STOCK INFO RETRIEVER --

# Retrieves all info on a stock
@bp.route('/info/<symbol>', methods=['GET'])
def info(symbol):
    data = stkh.get_info(symbol)
    if len(data) is not 0:
        return jsonify(data)
    else:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves Price-to-Earnings ratio
@bp.route('/pe/<symbol>', methods=['GET'])
def pe(symbol):
    try:
        data = stkh.get_pe_ratio(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves Earnings-per-Share
@bp.route('/eps/<symbol>', methods=['GET'])
def eps(symbol: str):
    try:
        data = stkh.get_eps(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves Market capitalisation
@bp.route('/marketcap/<symbol>', methods=['GET'])
def marketcap(symbol):
    try:
        data = stkh.get_market_cap(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves current bid price
@bp.route('/bid/<symbol>', methods=['GET'])
def bid(symbol):
    try:
        data = stkh.get_bid_price(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves current asking price
@bp.route('/ask/<symbol>', methods=['GET'])
def ask(symbol):
    try:
        data = stkh.get_ask_price(symbol)
        return Response(str(data))
    except KeyError:
        return Response(f"Symbol: {symbol.upper()} was not found.", status=404)


# Retrieves the industry given symbol
@bp.route('/industry/<symbol>', methods=['GET'])
def industry(symbol):
    data = stkh.get_industry(symbol)
    symbol = symbol.upper()

    if not data:
        return Response(f"Could not find anything with the symbol : {symbol}.", status=404)
    return Response(data, status=200)


# Retrieves random sample of data
@bp.route('/random/', methods=['GET'])
def random():
    number = request.args.get("n", default=10)  # random

    try:
        if number and number > 0:
            number = int(number)
    except ValueError:
        return Response(f"Please enter a valid positive integer for the number n: {number}.", status=400)

    data = stkh.get_random(number)
    list_data = stkh.df_to_dict(data, orient="records")

    if not list_data:
        return Response(f"Could not find random samples", status=404)  # Uh oh.

    return jsonify(list_data)


@bp.route('/infos/<tickers>', methods=['GET'])
def infos(tickers):
    # Tickers as comma-separated values: E.g. "MSFT,AAPL,NFLX"
    tickers = tickers.upper()
    tickers = tickers.replace(" ", "")
    list_of_tickers = tickers.split(",")
    data = stkh.get_stocks_infos(list_of_tickers)

    list_data = stkh.df_to_dict(data, orient="records")

    if not list_data:
        return Response(f"Could not find stocks with those ticker values. ", status=404)

    return jsonify(list_data)
