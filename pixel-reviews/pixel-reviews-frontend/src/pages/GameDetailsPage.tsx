import { useEffect, useState } from "react";
import { gameDetails } from "@/services/gameDataService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type {Game, Rating, Review} from '@/types/gameTypes'

function GameDetailsPage() {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [error, setError] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const bringGameDetails = async () => {
      try {
        const response = await gameDetails(slug || "");
        setGameData(response.data.game_data);
        setUserRating(response.data.user_rating_data)
        setUserReview(response.data.user_review_data)
        console.log(response);
      } catch (error: any) {
        console.log("error", error);
        if (error.status == 401) navigate("/auth/login");
        if (error.status == 404) setError("404")
      }
    };
    bringGameDetails();
  }, []);

  if (error == "404") {
    return <h1>El Juego no existe</h1>
  }

  return (
    <div>
      <h1 className="text-white">{gameData?.title}</h1>
      <h1 className="text-white">{gameData?.description}</h1>
      <h1 className="text-white">{gameData?.game_id}</h1>
      <h1 className="text-white">{gameData?.releaseDate}</h1>
      <h1 className="text-white">{gameData?.slug}</h1>

      <h1 className="text-white">User Review</h1>
      <h1 className="text-white">{userRating?.score}</h1>
      <h1 className="text-white">{userReview?.title}</h1>
      <h1 className="text-white">{userReview?.title}</h1>
      <h1 className="text-white">{userReview?.createdAt}</h1>
    </div>
  );
}

export default GameDetailsPage;
