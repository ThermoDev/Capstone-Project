from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort

# IMPORT FUNCTIONS HERE

bp = Blueprint('api', __name__, url_prefix='/api/v1')

# NEW ROUTES HERE
@bp.route('/', methods=['GET'])
def index():
    return jsonify({
        "username": "martinle",
        "password": "redshiba",
        "portfolio": [
            'GOOG',
            'AMZN',
            'AAPL',
            'MSFT'
        ]
    })
