import { useState, useEffect } from "react";
import { searchGames } from "@/services/gameDataService";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GameCard } from "@/components/gameComponents/GameCard";

import type { SearchedGame } from "@/types/gameTypes";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";

function SearchGamesResultPage() {
  const [gameResults, setGameResults] = useState<Array<SearchedGame> | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    bringGameResults();
  }, []);

  if (loading) {
    return <SpinnerComponent />;
  }

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
                <GameCard
                  imageURL={game.imageURL}
                  title={game.title}
                  description="hola"
                  released={game.releaseDate}
                />
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
