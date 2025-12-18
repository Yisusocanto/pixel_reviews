import { dateFormatter } from "@/lib/dateFormatter";
import { Developer, Game, Publisher } from "@/types/gameTypes";
import { Card, Separator } from "@heroui/react";

interface GameInformationCardProps {
  game: Game;
}

function GameInformationCard({ game }: GameInformationCardProps) {
  return (
    <div className="w-full md:max-w-sm">
      <Card className="flex flex-col gap-4 border">
        <h3 className="text-lg text-bold">Information</h3>
        <div>
          <h4 className="text-lg text-muted">Developers</h4>
          {game.developers?.map((developer: Developer) => (
            <div className="flex flex-col" key={developer.developerID}>
              <span className="text-lg">{developer.name}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div>
          <h4 className="text-lg text-muted">Publishers</h4>
          {game.publishers?.map((publisher: Publisher, index: number) => (
            <div className="flex flex-col" key={index}>
              <span className="text-lg">{publisher.name}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div>
          <h4 className="text-lg text-muted">Release Date</h4>
          <span className="text-lg">{dateFormatter(game.releaseDate)}</span>
        </div>
      </Card>
    </div>
  );
}

export default GameInformationCard;
