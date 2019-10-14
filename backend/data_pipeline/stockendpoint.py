from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort

# IMPORT FUNCTIONS HERE
from . import stockhelper as stkh

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