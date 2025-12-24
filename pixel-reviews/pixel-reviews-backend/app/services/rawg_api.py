import os
from typing import Optional

from dotenv import load_dotenv
import requests

load_dotenv()


class RawgApi:

    api_key = os.getenv("API_RAWG_KEY")
    BASE_URL = "https://api.rawg.io/api"

    @classmethod
    def search_games(cls, game_title: str) -> Optional[list]:
        response = requests.get(
            f"{cls.BASE_URL}/games",
            params={"key": cls.api_key, "search": game_title, "page_size": 10},
        )

        if response.status_code != 200:
            print(
                f"Error en search_games de Rawg API. status code {response.status_code}."
            )
            return None

        games_json = response.json()
        games_list = []

        for game in games_json["results"]:
            videogame = {
                "title": game["name"],
                "slug": game["slug"],
                "releaseDate": game["released"],
                "imageURL": game["background_image"],
            }
            games_list.append(videogame)

        return games_list

    @classmethod
    def get_game_details(cls, slug) -> Optional[dict]:
        response = requests.get(f"{cls.BASE_URL}/games/{slug}?key={cls.api_key}")
        if response.status_code != 200:
            print(
                f"Error en get_game_details de Rawg API. status code {response.status_code}."
            )
            return None

        game_json = response.json()
        screenshots_list = cls._get_game_screenshots(slug)
        game_data = {
            "rawg_id": game_json["id"],
            "title": game_json["name"],
            "slug": game_json["slug"],
            "release_date": game_json["released"],
            "image_url": game_json["background_image"],
            "screenshots": screenshots_list,
            "description": game_json["description_raw"],
            "developers": [
                {
                    "rawg_id": developer["id"],
                    "name": developer["name"],
                    "slug": developer["slug"],
                }
                for developer in game_json["developers"]
            ],
            "publishers": [
                {
                    "rawg_id": publisher["id"],
                    "name": publisher["name"],
                    "slug": publisher["slug"],
                }
                for publisher in game_json["publishers"]
            ],
        }
        return game_data

    @classmethod
    def _get_game_screenshots(cls, game_slug):
        response = requests.get(
            f"{cls.BASE_URL}/games/{game_slug}/screenshots?key={cls.api_key}"
        )

        if response.status_code != 200:
            print(f"Error on get_game_screenshots: {response.status_code}")
            return None

        data = response.json()

        if data["count"] == 0:
            return None

        screenshots_list = [
            screenshot_url["image"] for screenshot_url in data["results"]
        ]
        return screenshots_list
