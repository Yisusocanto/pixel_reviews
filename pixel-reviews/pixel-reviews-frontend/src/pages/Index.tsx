import { useState, useEffect } from "react";
import { indexPageData } from "@/services/indexPageService";
import { Link } from "react-router-dom";

import type { Review } from "@/types/gameTypes";

import { Button } from "flowbite-react";
import SearchBar from "../components/commonsComponents/SearchBar";

function Index() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    const bringIndexPageData = async () => {
      try {
        const response = await indexPageData();
        console.log(response);
        setReviews(response.data.reviews);
      } catch (error: any) {
        console.log(error);
      }
    };
    bringIndexPageData();
  }, []);

  return (
    <div>
      <SearchBar />
      <Button>Esto es un boton</Button>

      {reviews?.map((review: Review) => {
        return (
          <div>
            <Link to={`/games/${review.game?.slug}`}>
              <img src={review.game?.imageURL} alt="" />
              <h1>Game name:{review.game?.title}</h1>
              <h3>Review Tile: {review.title}</h3>
              <p>{review.content}</p>

              <h4>
                Author username: {review.author?.username}
                <span>fecha: {review.createdAt}</span>
              </h4>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Index;
