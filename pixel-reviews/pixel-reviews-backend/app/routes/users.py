from flask import Blueprint, jsonify, request
from app.database import UserManager, ReviewManager
from app.database.wishlist_manager import WishlistManager
from app.utils import JwtHandler


users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/<username>")
def profile(username):
    user = UserManager.get_user_by_username(username=username)
    if not user:
        return (
            jsonify(
                {"error": "An error occurred returning the user data or do not exits"}
            ),
            404,
        )

    return jsonify({"user": user}), 200


@users_bp.route("/<target_username>/reviews", methods=["GET"])
def recent_user_reviews(target_username):
    # Auth user's user_id to verify if the review has like or not
    user_id = None
    token = request.cookies.get("jwt_pixel_reviews")
    if token:
        payload = JwtHandler.check_jwt(token)
        if payload:
            user_id = int(payload["sub"])

    page = request.args.get("page")
    limit = request.args.get("limit")

    if page and limit:
        try:
            page_number = int(page)
            limit_number = int(limit)
        except Exception as e:
            print(f"Error on route '/recent_user_reviews': {e}")
            return (
                jsonify(
                    {"error": "Type error on page or limit param. It should be Integer"}
                ),
                400,
            )
    else:
        return (
            jsonify({"error": "The query params 'page' and 'limit' are obligatory"}),
            400,
        )

    # Target user_id of the user from whom the reviews are requested
    target_user_id = UserManager.get_user_id(target_username)

    offset = (page_number - 1) * limit_number

    reviews = ReviewManager.recent_user_reviews(
        target_user_id=target_user_id,
        limit=limit_number,
        offset=offset,
        user_id=user_id,
    )

    if isinstance(reviews, dict):
        return jsonify(reviews), 500

    return (
        jsonify(
            {
                "results": reviews,
                "info": {
                    "page": page_number,
                    "limit": limit_number,
                    "results": len(reviews),
                },
            }
        ),
        200,
    )


@users_bp.route("/<username>/wishlist", methods=["GET"])
def wishlist(username):
    page = request.args.get("page")
    limit = request.args.get("limit")

    if page and limit:
        try:
            page_number = int(page)
            limit_number = int(limit)
        except Exception as e:
            print(f"Error on route '/wishlist': {e}")
            return (
                jsonify(
                    {"error": "Type error on page or limit param. It should be Integer"}
                ),
                400,
            )
    else:
        return (
            jsonify({"error": "The query params 'page' and 'limit' are obligatory"}),
            400,
        )

    user_id = UserManager.get_user_id(username)
    if not user_id:
        return jsonify({"error": "User does not exits."})

    offset = (page_number - 1) * limit_number

    wishlist_items = WishlistManager.get_recent_wishlist_items(
        user_id=user_id, offset=offset, limit=limit_number
    )
    if isinstance(wishlist_items, dict):
        return jsonify(wishlist_items)

    return (
        jsonify(
            {
                "results": wishlist_items,
                "info": {
                    "page": page_number,
                    "limit": limit_number,
                    "results": len(wishlist_items),
                },
            }
        ),
        200,
    )
