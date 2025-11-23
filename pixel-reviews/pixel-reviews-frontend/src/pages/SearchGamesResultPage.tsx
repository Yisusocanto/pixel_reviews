import { useParams, Link } from "react-router-dom";
// Components
import { GameCard } from "@/components/gameComponents/GameCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import NotResultsPage from "./NotResultsPage";
// Services
import { useSearchGames } from "@/hooks/fetching/games/useGetGames";
// Types
import type { SearchedGame } from "@/types/gameTypes";

function SearchGamesResultPage() {
  const { gameTitle } = useParams();

  const { data, isLoading, isError, error } = useSearchGames(gameTitle || "");

  if (isLoading) {
    return <SpinnerComponent />;
  }

  //@ts-ignore
  if (isError && error.response.status == 404) {
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
          <h1 className="text-4xl text-center font-bold font-orbitron mb-4">
            Results for {gameTitle}
          </h1>
          {data && data.game_list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.game_list.map((game: SearchedGame) => (
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
