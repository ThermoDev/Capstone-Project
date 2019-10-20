from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify, Response
)

# IMPORT FUNCTIONS HERE
from backend.data_pipeline import newshelper as newsh

bp = Blueprint('news', __name__, url_prefix='/news')


# Index route that retrieve latest headlines
@bp.route('/', methods=['GET'])
def index():
    latest_headlines = newsh.retrieve_headlines()
    return jsonify(latest_headlines)


# Route to search a query
@bp.route('/search/<query>', methods=['GET'])
def search(query: str):
    searched_articles = newsh.search_news(query)
    return jsonify(searched_articles)
