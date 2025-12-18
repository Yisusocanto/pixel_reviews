import Image from "next/image";
import { Card } from "@heroui/react";
import { dateFormatter } from "@/lib/dateFormatter";
import { orbitron } from "@/fonts/fonts";

interface GameResultCardProps {
  imageURL: string;
  title: string;
  released: string;
  description?: string;
  className?: string;
}

export const GameResultCard = ({
  imageURL,
  title,
  released,
  className,
}: GameResultCardProps) => {
  return (
    <Card
      className={`group border flex flex-col h-full w-xs sm:w-xs xl:w-sm max-w-sm cursor-pointer gap-4 p-0 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl ${className}`}
    >
      <Card.Header className="p-0">
        <div className="w-full h-64 relative overflow-hidden">
          <Image
            src={imageURL || "/default-cover.png"}
            alt="game cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Card.Header>
      <Card.Content className="px-4 pb-4">
        <h1 className={`${orbitron.className} text-xl font-bold`}>{title}</h1>
        <div className="text-muted">
          <span>Released</span> &bull; <span>{dateFormatter(released)}</span>
        </div>
      </Card.Content>
    </Card>
  );
};
