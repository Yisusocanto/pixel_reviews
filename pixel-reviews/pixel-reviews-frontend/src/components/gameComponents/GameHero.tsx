import { Star, MessageCircle, Download, Link2, Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../luxe/button";
// Types
import type { Game } from "@/types/gameTypes";

interface GameHeroProps {
  gameData?: Game;
}

const GameHero = ({ gameData }: GameHeroProps) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${gameData?.imageURL})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 via-40% to-transparent to-70% z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-12 px-8 text-primary">
        {/* Tags */}
        {/* <div className="flex gap-2 mb-4">
        <Badge variant={"secondary"} className="text-base">
          RPG
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Action
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Shooter
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Strategy
        </Badge>
      </div> */}

        {/* Title */}
        <h1 className="text-4xl font-bold font-orbitron mb-4">
          {gameData?.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" />
            <span className="text-4xl font-bold">
              {gameData?.averageRating}
            </span>
            <span className="text-xl text-primary-muted">/ 5</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="text-primary fill-primary" />
            <span className="text-base text-primary-muted">
              {gameData?.totalReviews} reseñas
            </span>
          </div>
        </div>

        {/* Buttons */}
        {/* {<div className="flex gap-4">
          <Button
            className="px-6 py-3 font-semibold flex items-center gap-2 cursor-pointer shadow-2xl"
            variant="shine"
          >
            <Download />
            Save in Library
          </Button>
          <Button className=" px-6 py-3 font-semibold flex items-center gap-2 cursor-pointer shadow-2xl">
            <Heart />
            Wishlist
          </Button>
        <Button className=" px-4 py-3 cursor-pointer shadow-2xl">
          <Link2 />
        </Button>
        </div>} */}
      </div>
    </div>
  );
};

export default GameHero;
