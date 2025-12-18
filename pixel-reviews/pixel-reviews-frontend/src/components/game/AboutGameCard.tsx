"use client";

import { useState } from "react";
import { Card } from "@heroui/react";

interface AboutGameCardProps {
  description: string;
}

function AboutGameCard({ description }: AboutGameCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 250;

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  return (
    <>
      <h3 className="text-2xl font-bold">About the game</h3>
      <Card className="w-full md:max-w-2xl m-auto md:m-0 border">
        <p className="text-base">
          {isExpanded
            ? description
            : `${description.slice(0, MAX_LENGTH)}${
                description.length > MAX_LENGTH ? "..." : ""
              }`}
        </p>
        {description.length > MAX_LENGTH && (
          <button
            onClick={toggleReadMore}
            className="w-fit text-blue-600 hover:text-blue-500 text-sm font-bold mt-1 hover:underline cursor-pointer"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </Card>
    </>
  );
}

export default AboutGameCard;
