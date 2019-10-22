from exception.portfolio.portfolio_access_denied_error import PortfolioAccessDeniedError
from exception.portfolio.portfolio_not_found_error import PortfolioNotFoundError
from flask import (
    Blueprint, request, Response, jsonify
)
from flask_login import login_required, current_user
from portfolio.portfolio_manager import PortfolioManager
from utils.serialiser import serialise_properties

bp = Blueprint('portfolios', __name__, url_prefix='/portfolios')

portfolio_manager = PortfolioManager()


# Portfolio Routes
@bp.route('', methods=['GET'])
@login_required
def portfolios():
    user_id = current_user.get_id()

    portfolio_id = request.args.get('portfolio_id')
    if portfolio_id:
        try:
            portfolio = portfolio_manager.get_portfolio_for_user_by_id(user_id, portfolio_id)
        except (PortfolioAccessDeniedError, PortfolioNotFoundError) as e:
            return Response(response=e.message, status=403)

        return jsonify(serialise_properties(portfolio)), 200

    response = []
    for portfolio in portfolio_manager.get_all_portfolios_for_user(user_id):
        response.append(serialise_properties(portfolio))

    return jsonify(response), 200
