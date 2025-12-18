import { GameResultCard } from "@/components/game/GameResultCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { searchGames } from "@/services/gameService";
import type { SearchedGame } from "@/types/gameTypes";
import axios from "axios";

interface PageProps {
  params: Promise<{
    query: string;
  }>;
}

async function page({ params }: PageProps) {
  const { query: rawQuery } = await params;
  const query = decodeURIComponent(rawQuery);

  let data;
  try {
    data = await searchGames(query);
  } catch (error) {
    if (axios.isAxiosError(error) && error.status === 404) notFound();
    throw error;
  }

  const gameList = data.game_list;

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6 px-4">
      <main className="flex-1">
        <div className="mt-4">
          <h1 className="text-4xl text-center font-bold font-orbitron mb-4">
            Results for <span className="text-blue-500">{query}</span>
          </h1>
          {gameList && gameList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameList.map((game: SearchedGame) => (
                <div key={game.slug} className="w-fit m-auto">
                  <Link href={`/games/${game.slug}`}>
                    <GameResultCard
                      imageURL={game.imageURL}
                      title={game.title}
                      released={game.releaseDate}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default page;
