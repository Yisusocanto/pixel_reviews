import { useEffect, useState } from "react";
import { gameDetails } from "@/services/gameDataService";
import { useParams, useNavigate } from "react-router-dom";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import type { Game, Rating, Review } from "@/types/gameTypes";
import { ReviewCard } from "@/components/gameReviewComponents/ReviewCard";

function GameDetailsPage() {
  const [gameData, setGameData] = useState<Game | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const bringGameDetails = async () => {
      try {
        const response = await gameDetails(slug || "");
        setGameData(response.data.game_data);
        setUserRating(response.data.user_rating_data);
        setUserReview(response.data.user_review_data);
        console.log(response);
      } catch (error: any) {
        console.log("error", error);
        if (error.status == 401) navigate("/auth/login");
        if (error.status == 404) setError("404");
      } finally {
        setLoading(false);
      }
    };
    bringGameDetails();
  }, [slug, navigate]);

  if (loading) {
    return (
      <SpinnerComponent/>
    );
  }

  if (error == "404") {
    return <h1>El Juego no existe</h1>;
  }

  return (
    <div>
      <h1 className="text-white">{gameData?.title}</h1>
      <h1 className="text-white">{gameData?.description}</h1>
      <h1 className="text-white">{gameData?.game_id}</h1>
      <h1 className="text-white">{gameData?.releaseDate}</h1>
      <h1 className="text-white">{gameData?.slug}</h1>

      {userReview ? (
        <div>
          <h1>User Review</h1>
          <ReviewCard
            reviewTitle={userReview.title}
            username={userReview.author?.username}
            review={userReview.content}
            rating={userReview.rating?.score}
            imageUrl=""
          />
        </div>
      ) : null}
    </div>
  );
}

export default GameDetailsPage;
