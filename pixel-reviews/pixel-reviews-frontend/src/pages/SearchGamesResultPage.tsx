import { useState, useEffect } from "react";
import type { SearchedGame } from "@/types/gameTypes";
import { searchGames } from "@/services/gameDataService";
import { useParams, useNavigate, Link } from "react-router-dom";

function SearchGamesResultPage() {
  const [gameResults, setGameResults] = useState<Array<SearchedGame> | null>(
    null
  );
  const [error, setError] = useState("");
  const { gameTitle } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const bringGameResults = async () => {
      try {
        const response = await searchGames(gameTitle || "");
        setGameResults(response.data.game_list);
      } catch (error: any) {
        if (error.status == 401) navigate("/auth/login");
        if (error.status == 404) setError("404");
      }
    };
    bringGameResults();
  }, []);

  if (error == "404") {
    return <h1>No results</h1>;
  }

  return (
    <div>
      {gameResults ? (
        gameResults.map((game: SearchedGame) => {
          return (
            <div>
              <Link to={`/games/${game.slug}`}>
                <h1 className="text-white">{game.title}</h1>
                <img src={game.imageURL} alt="" />
                <h2 className="text-white">{game.releaseDate}</h2>
              </Link>
            </div>
          );
        })
      ) : (
        <h1>No results</h1>
      )}
    </div>
  );
}

export default SearchGamesResultPage;
