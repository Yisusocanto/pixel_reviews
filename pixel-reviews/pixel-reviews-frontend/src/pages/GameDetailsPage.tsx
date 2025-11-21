import { useState } from "react";
import { useParams } from "react-router-dom";
// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RatingComponent } from "@/components/ui/rating";
import { ReviewCard } from "@/components/gameReviewComponents/ReviewCard";
import { Card } from "@/components/luxe/card";
import { Star, Heart } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import GameHero from "@/components/gameComponents/GameHero";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import DialogReviewComponent from "@/components/gameReviewComponents/DialogReviewComponent";
import RatingStatistics from "@/components/gameReviewComponents/RatingStatistics";
import NotFoundPage from "./NotFoundPage";
// Types
import type { Developer, Publisher, Review } from "@/types/gameTypes";
// Services
import { useGameDetails } from "@/hooks/fetching/useGetGames";
import { useCreateRating } from "@/hooks/fetching/useReview";
// Utils
import { dateFormatter } from "@/utils/dateFormatter";
import { Button } from "@/components/ui/button";

function GameDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams();

  const { data, isLoading, isError, error } = useGameDetails(slug ?? "");

  const { mutate: createRating } = useCreateRating(slug ?? "");

  // Preview helpers
  const PREVIEW_WORDS = 40;
  const getPreview = (text?: string) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length <= PREVIEW_WORDS
      ? text
      : words.slice(0, PREVIEW_WORDS).join(" ") + "…";
  };
  const isLongDescription =
    !!data?.game?.description &&
    data.game.description.split(/\s+/).length > PREVIEW_WORDS;

  const displaySuccessToast = () => {
    toast.success("Rating created", {
      description: "Rating created/updated successfully",
      duration: 5000,
    });
  };

  const displayErrorToast = (error: string) => {
    toast.error("Error", {
      description: `Error creating/updating the rating: ${error}`,
      duration: 5000,
    });
  };

  const handleRatingChange = async (score: number) => {
    if (data?.game) {
      createRating(
        { gameID: data.game.game_id, score: score },
        {
          onSuccess: () => displaySuccessToast(),
          onError: (error: any) =>
            displayErrorToast(error.response.data.error ?? "Unknown error"),
        }
      );
    }
  };

  //@ts-ignore
  if (isError && error?.status == 404) {
    return <NotFoundPage />;
  }

  if (isLoading || !data?.game) {
    return <SpinnerComponent />;
  }

  return (
    <div>
      {/* Success or error notification */}
      <Toaster theme="dark" richColors={true} />
      {/* Game Hero */}
      <GameHero gameData={data?.game || undefined} />
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 w-full md:px-20  lg:px-35">
        {/* Left side */}
        <div className="flex-2">
          <Tabs defaultValue="overview" className="mx-8">
            <TabsList className="w-fit ">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              {/* {<TabsTrigger value="specs">Specs</TabsTrigger>} */}
            </TabsList>
            {/* Descripction and images of the video game */}
            <TabsContent value="overview">
              <div className="flex flex-col gap-4 items-start mt-8">
                <div className="max-w-sm md:max-w-2xl m-auto md:m-0">
                  <h3 className="text-2xl text-bold">About the game</h3>

                  {/* If description is short, show it all */}
                  {!isLongDescription ? (
                    <p>{data?.game?.description}</p>
                  ) : (
                    <div className="relative">
                      {/* Preview or full text with smooth max-height transition */}
                      <p
                        className={`transition-all duration-300 overflow-hidden`}
                        style={{
                          maxHeight: isOpen ? 1000 : 120, // ajusta valores según tu diseño
                        }}
                        aria-expanded={isOpen}
                      >
                        {isOpen
                          ? data?.game?.description
                          : getPreview(data?.game?.description)}
                      </p>

                      {/* Gradient overlay when collapsed */}
                      {!isOpen && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0 right-0 bottom-0 h-10"
                        />
                      )}

                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-500"
                          size="sm"
                          onClick={() => setIsOpen((v) => !v)}
                        >
                          {isOpen ? "Read less" : "Read more"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full items-center">
                  <RatingStatistics
                    classname="m-auto md:m-0"
                    gameData={data?.game || undefined}
                  />
                </div>
              </div>
            </TabsContent>
            {/* reviews of the videogame */}
            <TabsContent value="reviews">
              <div className="flex flex-col gap-4 items-center m-auto w-full max-w-sm md:max-w-xl mt-8">
                {/* Conditional if there are no reviews of the game, display a message */}
                {!data.userReview && data?.game.reviews?.length == 0 ? (
                  <p className="text-center text-primary-muted">
                    This game has no reviews yet
                  </p>
                ) : null}

                {/* Review of the main user if exits */}
                {data.userReview ? (
                  <div className="w-full flex flex-col gap-4">
                    <h3 className="text-xl text-bold text-center">
                      Your Review
                    </h3>
                    <ReviewCard review={data.userReview} />
                    <Separator />
                  </div>
                ) : null}

                {/* All the reviews that have a game */}
                {data?.game?.reviews
                  ?.filter(
                    (review: Review) =>
                      review.review_id !== data.userReview?.review_id
                  )
                  .map((review: Review, index: number) => (
                    <ReviewCard
                      review={review}
                      key={review.review_id ?? index}
                      className="w-full"
                    />
                  ))}
              </div>
            </TabsContent>
            {/* specs of the videogame */}
            {/* {<TabsContent value="specs">
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
            </TabsContent>} */}
          </Tabs>
        </div>
        {/* Right side */}
        <div className="flex-1 flex flex-col gap-4 items-center sm:pla mx-8">
          {/* Rating and Review Card */}
          <div className="w-full max-w-sm">
            <Card
              variant="default"
              className="flex flex-col items-center gap-4"
            >
              <h3 className="text-lg">Rate this game</h3>
              <div className="flex gap-2 items-center">
                <Star size={36} className="text-yellow-400 fill-yellow-400" />
                <span className="text-4xl text-bold">
                  {data?.game?.averageRating.toFixed(1)}
                </span>
                <span className="text-base">/ 5</span>
              </div>
              <span className="text-base text-primary-muted">
                Total Reviews: {data?.game?.totalRatings}
              </span>
              <Separator />
              <h4 className="text-lg">Your rating</h4>
              <RatingComponent
                size="lg"
                rating={data.userRating?.score || 0}
                editable
                showValue
                onRatingChange={handleRatingChange}
              />

              <DialogReviewComponent
                gameData={data.game || undefined}
                userRating={data.userRating || undefined}
                userReview={data.userReview || undefined}
              />
            </Card>
          </div>
          {/* Information Card */}
          <div className="w-full max-w-sm">
            <Card className="flex flex-col gap-4">
              <h3 className="text-lg text-bold">Information</h3>
              <div>
                <h4 className="text-lg text-primary-muted">Developers</h4>
                {data?.game?.developers?.map(
                  (developer: Developer, index: number) => (
                    <div className="flex flex-col" key={index}>
                      <span className="text-lg">{developer.name}</span>
                    </div>
                  )
                )}
              </div>
              <Separator />
              <div>
                <h4 className="text-lg text-primary-muted">Publishers</h4>
                {data?.game?.publishers?.map(
                  (publisher: Publisher, index: number) => (
                    <div className="flex flex-col" key={index}>
                      <span className="text-lg">{publisher.name}</span>
                    </div>
                  )
                )}
              </div>
              <Separator />
              <div>
                <h4 className="text-lg text-primary-muted">Release Date</h4>
                <span className="text-lg">
                  {dateFormatter(data?.game?.releaseDate || "")}
                </span>
              </div>
              {/* {<Separator />
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
              </div>} */}
            </Card>
          </div>
          {/* Community Card */}
          {
            <div className="w-full max-w-sm">
              <Card className="flex flex-col gap-4">
                <h3 className="text-lg">Community</h3>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Heart size={18} />
                    <span className="text-lg">In Wishlist</span>
                  </div>
                  <span className="text-lg">
                    {data?.game?.wishlist?.length}
                  </span>
                </div>
              </Card>
            </div>
          }
          {/* {<div className="w-sm m-auto">
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
          </div>} */}
        </div>
      </div>
    </div>
  );
}

export default GameDetailsPage;
