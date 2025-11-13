import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
// Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/luxe/dialog";
import { RatingComponent } from "../ui/rating";
import { Button } from "../luxe/button";
import { Input } from "../luxe/input";
import { Textarea } from "../ui/textarea";
import { toast, Toaster } from "sonner";
import AccentButton from "../commonsComponents/AccentButton";
// Services
import { createReview } from "@/services/apiService";
// types
import type { Game, Rating, Review } from "@/types/gameTypes";
import { HelperText } from "flowbite-react";

// Form Schema
const ReviewSchema = z.object({
  title: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(100, { message: "The field should have maximun 100 characters" }),
  content: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(3000, { message: "The field should have maximun 3000 characters" }),
});

interface DialogReviewProps {
  userRating?: Rating;
  setUserRating: React.Dispatch<Rating | null>;
  userReview?: Review;
  setUserReview: React.Dispatch<Review | null>;
  gameData?: Game;
}

function DialogReviewComponent({
  userRating,
  setUserRating,
  userReview,
  setUserReview,
  gameData,
}: DialogReviewProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ReviewSchema) });

  const [score, setScore] = useState<number>(0);
  const [ratingError, setRatingError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // Dialog controller

  // Success toast
  const displaySuccessToast = () =>
    toast.success("Review created", {
      description: "The review has been created/edited successfully",
      duration: 5000,
    });

  // Success toast
  const displayErrorToast = (error: string) =>
    toast.error("Error", {
      description: `Error creating/updating the review: ${error}`,
      duration: 5000,
    });

  // The score state is set as soon as userRating is available
  useEffect(() => {
    setScore(userRating?.score || 0);
  }, [userRating]);

  // Individual characterLimit hook's instances for each input
  const titleInput = useCharacterLimit(100, userReview?.title);
  const contentInput = useCharacterLimit(3000, userReview?.content);

  const onSubmit = handleSubmit(async (data) => {
    if (score == 0) {
      setRatingError("You must give a rating");
      return;
    }
    try {
      const { title, content } = data;
      const response = await createReview(
        gameData?.game_id || 0,
        title,
        content,
        score
      );
      setUserRating(response.data.rating);
      setUserReview(response.data.review);
      setIsOpen(false);
      displaySuccessToast();
    } catch (error: any) {
      displayErrorToast(error.response.data.error);
      setIsOpen(false);
    }
  });

  return (
    <div>
      {/* This display the toast in the screen */}
      <Toaster theme="dark" richColors={true} />

      {/* Dialog Window */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Dialog Button */}
        <DialogTrigger asChild className="w-full">
          <AccentButton className="cursor-pointer">Write a review</AccentButton>
        </DialogTrigger>
        {/* Dialog Content */}
        <DialogContent>
          {/* Dialog Title */}
          <DialogTitle className="flex flex-col">
            <span className="text- text-primary-muted ">
              Write a review of this game
            </span>
            <span className="text-2xl font-orbitron">{gameData?.title}</span>
          </DialogTitle>

          {/* Dialog Body */}
          <DialogDescription asChild>
            <div className="flex flex-col gap-1">
              <span className="text-base text-primary-muted">Rating</span>
              <RatingComponent
                size="lg"
                rating={score}
                editable
                showValue
                onRatingChange={setScore}
              />
              {ratingError && (
                <span className="text-destructive-secondary">
                  {ratingError}
                </span>
              )}
              {/* Form */}
              <form className="mt-4 mb-8">
                <div className="flex flex-col gap-2">
                  {/* Review's Title */}
                  <label htmlFor="title" className="text-base">
                    Title
                  </label>
                  <Input
                    type="text"
                    className="text-primary w-full"
                    defaultValue={userReview?.title}
                    {...register("title", {
                      onChange: (e) => titleInput.handleChange(e.target.value),
                    })}
                    style={{ color: "rgb(246 246 246)" }}
                    maxLength={titleInput.maxLength}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-destructive-secondary">
                      {errors.title?.message}
                    </span>
                    <HelperText className="mt-0">
                      {titleInput.characterCount}/{titleInput.maxLength}
                    </HelperText>
                  </div>
                  {/* Review's Content */}
                  <label htmlFor="content" className="text-base">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    {...register("content", {
                      onChange: (e) =>
                        contentInput.handleChange(e.target.value),
                    })}
                    defaultValue={userReview?.content}
                    variant="lg"
                    className="bg-main-secondary"
                    maxLength={contentInput.maxLength}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-destructive-secondary">
                      {errors.content?.message}
                    </span>
                    <HelperText className="mt-0">
                      {contentInput.characterCount}/{contentInput.maxLength}
                    </HelperText>
                  </div>
                </div>
              </form>
            </div>
          </DialogDescription>
          {/* Dialog Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
            <DialogClose asChild>
              <AccentButton onClick={onSubmit}>Review It</AccentButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogReviewComponent;
