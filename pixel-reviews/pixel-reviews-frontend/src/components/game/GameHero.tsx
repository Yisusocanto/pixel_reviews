import { Star, MessageCircle } from "lucide-react";
import WishListButton from "@/components/actions/WishlistButton";
import { orbitron } from "@/fonts/fonts";
import type { Game } from "@/types/gameTypes";

interface GameHeroProps {
  game?: Game;
}

const GameHero = ({ game }: GameHeroProps) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${game?.imageURL})`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 via-40% to-transparent to-70% z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-8 w-full md:w-3/4 mx-auto px-4 md:px-8 gap-2">
        {/* Title */}
        <h1 className={`${orbitron.className} text-5xl font-bold`}>
          {game?.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" />
            <span className="text-4xl font-bold">
              {game?.averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-muted">/ 5</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="fill-foreground" />
            <span className="text-base text-muted">
              {game?.totalReviews} reviews
            </span>
          </div>
        </div>
        <div>
          <WishListButton game={game} />
        </div>
      </div>
    </div>
  );
};

export default GameHero;
