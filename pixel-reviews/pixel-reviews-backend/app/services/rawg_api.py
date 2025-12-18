import os
from dotenv import load_dotenv
import requests

load_dotenv()


class RawgApi:

    api_key = os.getenv("API_RAWG_KEY")
    BASE_URL = "https://api.rawg.io/api"

    def search_games(self, game_title: str) -> list | None:
        response = requests.get(
            f"{self.BASE_URL}/games",
            params={"key": self.api_key, "search": game_title, "page_size": 10},
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
                "imageURL": game["background_image"]
            }
            games_list.append(videogame)

        return games_list

    def get_game_details(self, slug) -> dict | None:
        response = requests.get(f"{self.BASE_URL}/games/{slug}?key={self.api_key}")
        if response.status_code != 200:
            print(
                f"Error en get_game_details de Rawg API. status code {response.status_code}."
            )
            return None

        game_json = response.json()
        screenshots_list = self._get_game_screenshots(slug)
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

    def _get_game_screenshots(self, game_slug):
        response = requests.get(f"{self.BASE_URL}/games/{game_slug}/screenshots?key={self.api_key}")

        if response.status_code != 200:
            print(f"Error on get_game_screenshots: {response.status_code}")
            return None

        data = response.json()

        if data["count"] == 0:
            return None

        screenshots_list = [screenshot_url["image"] for screenshot_url in data["results"]]
        return screenshots_list


