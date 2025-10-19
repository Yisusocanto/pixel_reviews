import { useEffect, useState } from "react";
import { gameDetails } from "@/services/gameDataService";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RatingComponent } from "@/components/ui/rating";
import { createRating } from "@/services/apiService";
import { ReviewCard } from "@/components/gameReviewComponents/ReviewCard";
import { Card } from "@/components/luxe/card";
import { Star, Users, MessageSquare, Heart, LaptopMinimal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {toast, Toaster} from "sonner"
import GameHero from "@/components/gameComponents/GameHero";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import type { Game, Rating, Review } from "@/types/gameTypes";

// Dialog
import DialogReviewComponent from "@/components/gameReviewComponents/DialogReviewComponent";

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

  const displaySuccessToast = () => {
    toast.success("Rating created", {
      description: "Rating created/updated successfully",
      duration: 5000
    })
  }

  const displayErrorToast = (error: string) => {
    toast.error("Error", {
      description: `Error creating/updating the rating: ${error}`,
      duration: 5000
    })
  } 

  const handleRatingChange = async (score: number) => {
    if (gameData) {
      try {
        const response = await createRating(gameData.game_id, score);
        setUserRating(response.data.rating);
        setUserReview(response.data.review);
        displaySuccessToast()
      } catch (error: any) {
        console.log(error);
        setError(error.response.data.error);
        displayErrorToast(error.response.data.error)
      }
    }
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error == "404") {
    return <h1>El Juego no existe</h1>;
  }

  return (
    <div>
      <Toaster theme="dark" richColors={true}/>
      <GameHero gameData={gameData || undefined} />
      <div className="flex w-full">
        {/* Left side */}
        <div className="flex-2 ,">
          <Tabs defaultValue="overview" className="mx-8">
            <TabsList className="w-fit ">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
            </TabsList>
            {/* Descripction and images of the video game */}
            <TabsContent value="overview">
              <div className="flex flex-col gap-4 items-start mt-8">
                <h3 className="text-2xl text-bold">About the game</h3>
                <p className="text-base text-muted-foreground text-pretty">
                  {gameData?.description}
                </p>
              </div>
            </TabsContent>
            {/* reviews of the videogame */}
            <TabsContent value="reviews">
              <div className="flex flex-col gap-4 items-center m-auto w-xl mt-8">
                {/* Review of the main user if exits */}
                {userReview ? (
                  <div className="w-full flex flex-col gap-4">
                    <h3 className="text-xl text-bold text-center">
                      Your Review
                    </h3>
                    <ReviewCard review={userReview} />
                    <Separator />
                  </div>
                ) : null}
                {/* All the reviews that have a game */}
                {gameData?.reviews
                  ?.filter(
                    (review) => review.review_id !== userReview?.review_id
                  )
                  .map((review, index) => (
                    <ReviewCard
                      review={review}
                      key={review.review_id ?? index}
                      className="w-full"
                    />
                  ))}
              </div>
            </TabsContent>
            {/* specs of the videogame */}
            <TabsContent value="specs">
              <div className="mt-8">
                <Card className="px-8">
                  <h3 className="text-xl text-bold mb-4">Specs</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-lg text-primary-muted">Minimum</h3>
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">CPU</h4>
                        <span>Intel Core i5-8400 / AMD Ryzen 5 2600</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">GPU</h4>
                        <span>NVIDIA GTX 1060 6GB / AMD RX 580 8GB</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">RAM</h4>
                        <span>8 GB</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">Storage</h4>
                        <span>80 Gb</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-lg text-primary-muted">
                        Recommended
                      </h3>
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">CPU</h4>
                        <span>Intel Core i7-10700K / AMD Ryzen 7 3700X</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">GPU</h4>
                        <span>NVIDIA RTX 3070 / AMD RX 6800 XT</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">RAM</h4>
                        <span>16 GB</span>
                      </div>
                      <Separator />
                      <div className="flex flex-col">
                        <h4 className="text-primary-muted">Storage</h4>
                        <span>80 Gb</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Right side */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Rating and Review Card */}
          <div className="w-sm m-auto">
            <Card variant="shine" className="flex flex-col gap-4 ">
              <h3 className="text-lg">Rate this game</h3>
              <div className="flex gap-2 items-center">
                <Star size={36} className="text-yellow-400 fill-yellow-400"/>
                <span className="text-4xl text-bold">{gameData?.averageRating}</span>
                <span className="text-base">/ 5</span>
              </div>
              <span className="text-base text-primary-muted">
                Total Reviews: {gameData?.totalRatings}
              </span>
              <Separator />
              <h4 className="text-lg">Your rating</h4>
              <RatingComponent
                size="lg"
                rating={userRating?.score || 0}
                editable
                showValue
                onRatingChange={handleRatingChange}
              />

              <DialogReviewComponent
                gameData={gameData || undefined}
                userRating={userRating || undefined}
                setUserRating={setUserRating}
                userReview={userReview || undefined}
                setUserReview={setUserReview}
              />
            </Card>
          </div>
          {/* Information Card */}
          <div className="w-sm m-auto">
            <Card className="flex flex-col gap-4">
              <h3 className="text-lg text-bold">Information</h3>
              <div>
                <h4 className="text-lg text-primary-muted">Developers</h4>
                {gameData?.developers?.map((developer, index) => (
                  <div className="flex flex-col" key={index}>
                    <span className="text-lg">{developer.name}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div>
                <h4 className="text-lg text-primary-muted">Publishers</h4>
                {gameData?.publishers?.map((publisher, index) => (
                  <div className="flex flex-col" key={index}>
                    <span  className="text-lg">
                      {publisher.name}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div>
                <h4 className="text-lg text-primary-muted">Release Date</h4>
                <span className="text-lg">{gameData?.releaseDate}</span>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Badge variant={"outline"} className="flex gap-2">
                  <LaptopMinimal size={14} /> PC
                </Badge>
                <Badge variant={"outline"} className="flex gap-2">
                  <LaptopMinimal size={14} /> Play Station 5
                </Badge>
                <Badge variant={"outline"} className="flex gap-2">
                  <LaptopMinimal size={14} /> Xbox Series X
                </Badge>
              </div>
            </Card>
          </div>
          {/* Community Card */}
          <div className="w-sm m-auto">
            <Card className="flex flex-col gap-4">
              <h3 className="text-lg">Community</h3>
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Users size={18} />
                  <span className="text-lg">Active Players</span>
                </div>
                <span className="text-lg">237K</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <MessageSquare size={18} />
                  <span className="text-lg">Discussions</span>
                </div>
                <span className="text-lg">1.2K</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Heart size={18} />
                  <span className="text-lg">In Wishlist</span>
                </div>
                <span className="text-lg">437K</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetailsPage;
