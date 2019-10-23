from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify, Response
)

# IMPORT FUNCTIONS HERE
from backend.data_pipeline import newshelper as newsh
import urllib.parse
bp = Blueprint('news', __name__, url_prefix='/news')


# Index route that retrieve latest headlines
@bp.route('/', methods=['GET'])
def index():
    latest_headlines = newsh.retrieve_headlines()
    return jsonify(latest_headlines)


# Route to search a query
@bp.route('/search/<query>', methods=['GET'])
def search(query: str):
    query_decode = urllib.parse.unquote(query)
    #return query_decode
    searched_articles = newsh.search_news(query_decode)
    return jsonify(searched_articles)
