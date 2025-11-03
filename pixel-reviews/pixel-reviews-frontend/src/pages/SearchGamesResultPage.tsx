import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Components
import { GameCard } from "@/components/gameComponents/GameCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import NotResultsPage from "./NotResultsPage";
// Services
import { searchGames } from "@/services/gameDataService";
// Types
import type { SearchedGame } from "@/types/gameTypes";

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
    return <NotResultsPage gameTitle={gameTitle || ""} />;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {gameResults ? (
        gameResults.map((game: SearchedGame, e) => {
          return (
            <div key={e} className="w-full">
              <Link to={`/games/${game.slug}`}>
                <GameCard
                  imageURL={game.imageURL}
                  title={game.title}
                  released={game.releaseDate}
                  className="m-auto"
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
