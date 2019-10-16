from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort

# IMPORT FUNCTIONS HERE
from backend.data_pipeline import stockhelper as stkh

bp = Blueprint('stock', __name__, url_prefix='/stock')


# NEW ROUTES HERE
@bp.route('/', methods=['GET'])
def index():
    # Example: /stock/?ticker=MSFT&source=yahoo
    ticker = request.args.get("ticker")
    source = request.args.get("source")

    # Optional if the data source requires an API key
    api_key = request.args.get("api_key")

    data = stkh.get_data(ticker, source, api_key)
    return data.to_json()


@bp.route('/pctchange/', methods=['GET'])
def pctchange():
    ticker = request.args.get("ticker")
    source = request.args.get("source")
    api_key = request.args.get("api_key")

    data = stkh.get_pct_change(ticker, source, api_key)
    return str(data)


@bp.route('/dollarchange/', methods=['GET'])
def dollarchange():
    ticker = request.args.get("ticker")
    source = request.args.get("source")
    api_key = request.args.get("api_key")

    data = stkh.get_dollar_change(ticker, source, api_key)
    return str(data)\



@bp.route('/ytd/', methods=['GET'])
def ytd():
    ticker = request.args.get("ticker")
    source = request.args.get("source")
    api_key = request.args.get("api_key")

    data = stkh.get_ytd(ticker, source, api_key)
    return str(data)


# -- YAHOO stock info retriever --
@bp.route('/info/<ticker>', methods=['GET'])
def info(ticker):
    data = stkh.get_info(ticker)
    return jsonify(data)


@bp.route('/pe/<ticker>', methods=['GET'])
def pe(ticker):
    data = stkh.get_pe_ratio(ticker)
    return str(data)


@bp.route('/eps/<ticker>', methods=['GET'])
def eps(ticker):
    data = stkh.get_eps(ticker)
    return str(data)


@bp.route('/marketcap/<ticker>', methods=['GET'])
def marketcap(ticker):
    data = stkh.get_market_cap(ticker)
    return str(data)


@bp.route('/bid/<ticker>', methods=['GET'])
def bid(ticker):
    data = stkh.get_bid_price(ticker)
    return str(data)


@bp.route('/ask/<ticker>', methods=['GET'])
def ask(ticker):
    data = stkh.get_ask_price(ticker)
    return str(data)

