import { SimpleReviewCard } from "@/components/review/SimpleReviewCard";
import { Tabs } from "@heroui/react";
import { getGameDetails } from "@/services/gameService";
import GameHero from "@/components/game/GameHero";
import AboutGameCard from "@/components/game/AboutGameCard";
import { notFound } from "next/navigation";
import RatingStatistics from "@/components/review/RatingStatistics";
import ExpandableGallery from "@/components/ui/gallery-animation";
import ReviewRatingCard from "@/components/review/ReviewRatingCard";
import axios from "axios";
import GameInformationCard from "@/components/game/GameInformationCard";
import CommunityCard from "@/components/game/CommunityCard";
import { cookies } from "next/headers";
import type { Review } from "@/types/gameTypes";

interface pageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function page({ params }: pageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  let data;

  try {
    data = await getGameDetails(slug, cookieHeader);
  } catch (error) {
    if (axios.isAxiosError(error) && error.status === 404) notFound();
    throw error;
  }

  const game = data.game;

  return (
    <div>
      {/* Game Hero */}
      <GameHero game={game || undefined} />
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 w-full md:w-3/4 mx-auto px-4 md:px-0">
        {/* Left side */}
        <div className="flex-2 w-full">
          <Tabs defaultSelectedKey="overview" className="md:mx-8">
            <Tabs.ListContainer className="w-fit">
              <Tabs.List>
                <Tabs.Tab id="overview">
                  Overview
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
                <Tabs.Tab id="reviews">
                  Reviews
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            {/* Descripction and images of the video game */}
            <Tabs.Panel id="overview">
              <div className="flex flex-col gap-4 items-start mt-8">
                <AboutGameCard description={game?.description || ""} />

                {game?.screenshots && (
                  <div className="w-full items-center">
                    <h3 className="text-2xl  font-bold mb-2 m-auto w-xs sm:w-sm md:w-full">
                      Screenshots
                    </h3>
                    <ExpandableGallery
                      images={data?.game?.screenshots || []}
                      className="w-xs sm:w-sm md:w-full m-auto"
                    />
                  </div>
                )}

                <div className="w-full items-center">
                  <h3 className="text-2xl font-bold mb-2 m-auto w-xs sm:w-sm md:w-full">
                    Statistics
                  </h3>
                  <RatingStatistics
                    classname="m-auto md:m-0"
                    gameData={data?.game || undefined}
                  />
                </div>
              </div>
            </Tabs.Panel>
            {/* reviews of the videogame */}
            <Tabs.Panel id="reviews">
              <div className="flex flex-col gap-4 items-center m-auto w-full max-w-sm md:max-w-xl mt-8">
                {/* Conditional if there are no reviews of the game, display a message */}
                {game?.reviews?.length == 0 ? (
                  <p className="text-center text-primary-muted">
                    This game has no reviews yet
                  </p>
                ) : null}

                {/* All the reviews that have a game */}
                {game &&
                  game.reviews &&
                  game?.reviews.map((review: Review) => (
                    <SimpleReviewCard
                      review={review}
                      key={review.reviewID}
                      className="w-full"
                    />
                  ))}
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
        {/* Right side */}
        <div className="flex-1 flex flex-col gap-4 items-center sm:pla md:mx-8">
          {/* Rating and Review Card */}
          {game && <ReviewRatingCard game={game} />}
          {/* Information Card */}
          {game && <GameInformationCard game={game} />}
          {/* Community Card */}

          <CommunityCard wishlistCount={game?.totalWishlist || 0} />
        </div>
      </div>
    </div>
  );
}

export default page;
