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
  }, [gameTitle, navigate]);

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error == "404") {
    return <NotResultsPage gameTitle={gameTitle || ""} />;
  }

  return (
    // Layout:
    // - Mobile: column with filter on top and results below
    // - Desktop (lg+): row with results left and filter right
    <div className="flex flex-col lg:flex-row lg:items-start gap-6 px-4">
      {/* Filter placeholder: aparece primero en el DOM para que en móvil esté arriba.
          En pantallas lg+ lo movemos a la derecha con lg:order-last */}
      {/* {<aside className="w-full lg:w-80 lg:order-last">
        <div className="sticky top-20">
          <div className="p-4 bg-card rounded-lg shadow">
            
            hola
          </div>
        </div>
      </aside>} */}

      {/* Resultados: ocupan el espacio restante y muestran una grilla de 2 columnas */}
      <main className="flex-1">
        <div className="mt-4">
          {gameResults && gameResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameResults.map((game: SearchedGame) => (
                <div key={game.slug} className="w-fit m-auto">
                  <Link to={`/games/${game.slug}`}>
                    <GameCard
                      imageURL={game.imageURL}
                      title={game.title}
                      released={game.releaseDate}
                      className="m-auto"
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <h1>No results</h1>
          )}
        </div>
      </main>
    </div>
  );
}

export default SearchGamesResultPage;
