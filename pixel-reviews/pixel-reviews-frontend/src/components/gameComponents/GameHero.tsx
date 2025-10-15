import { Star, MessageCircle, Download, Link2, Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../luxe/button";

import type { Game } from "@/types/gameTypes";

interface GameHeroProps {
  gameData?: Game;
}

const GameHero = ({ gameData }: GameHeroProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${gameData?.imageURL})`,
        }}
      />

      {/* Overlay con gradiente y oscurecimiento */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-20 p-8 text-white">
        {/* Tags */}
        <div className="flex gap-2 mb-4">
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
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold font-orbitron mb-4">
          {gameData?.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star />
            <span className="text-2xl font-bold">9.2</span>
            <span className="text-base text-gray-300">/ 10</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle />
            <span className="text-base text-gray-300">1.847 reseñas</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            className="px-6 py-3 font-semibold flex items-center gap-2"
            variant="shine"
          >
            <Download />
            Jugar Ahora
          </Button>
          <Button className=" px-6 py-3 font-semibold flex items-center gap-2">
            <Heart />
            Wishlist
          </Button>
          <Button className=" px-4 py-3 ">
            <Link2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHero;
