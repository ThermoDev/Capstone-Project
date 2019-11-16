from datetime import datetime
from dateutil import parser as dateparser

from exception.game.game_not_found_error import GameNotFoundError
from exception.game.user_not_member_of_game_error import UserNotMemberOfGameError
from flask import (
    Blueprint, request, Response, jsonify
)
from flask_login import login_required, current_user
from game.game_manager import GameManager
from portfolio.portfolio_manager import PortfolioManager
from models.game import Game
from utils.serialiser import serialise_properties

bp = Blueprint('games', __name__, url_prefix='/games')

game_manager = GameManager()


@bp.route('', methods=['GET'])
@login_required
def games():
    user_id = current_user.get_id()

    game_id = request.args.get('game_id')
    if game_id:
        try:
            game = game_manager.get_game_for_user_by_id(user_id, game_id)
        except GameNotFoundError as e:
            return Response(response=e.message, status=404)
        except UserNotMemberOfGameError as e:
            return Response(response=e.message, status=403)

        return jsonify(_serialise_and_obscure_game(game, user_id), 200)

    response = []
    for game in game_manager.get_games_for_user(user_id):
        response.append(_serialise_and_obscure_game(game, user_id))

    return jsonify(response), 200


@bp.route('create', methods=['POST'])
@login_required
def create():
    user_id = current_user.get_id()

    name = request.json.get('name')
    start_date = dateparser.parse(request.json.get('start_date'))
    end_date = dateparser.parse(request.json.get('end_date'))
    usernames = request.json.get('usernames')
    initial_cash = request.json.get('cash')

    if user_id not in usernames:
        usernames.append(user_id)

    game = game_manager.create_game(name, start_date, end_date, usernames, initial_cash)

    return jsonify(_serialise_and_obscure_game(game, user_id)), 201


def _serialise_and_obscure_game(game: Game, user_id: str) -> dict:
    serialised = serialise_properties(game)
    if datetime.now() < game.end_date:
        for serialised_portfolio in serialised['portfolios']:
            if serialised_portfolio['holder'] != user_id:
                serialised['portfolios'].remove(serialised_portfolio)

    return serialised
