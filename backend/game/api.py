from flask import (
    Blueprint, request, Response, jsonify
)
from game.game_manager import GameManager

bp = Blueprint('games', __name__, url_prefix='/games')

game_manager = GameManager()
