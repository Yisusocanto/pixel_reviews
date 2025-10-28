import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/luxe/dialog";
import type { Game, Rating, Review } from "@/types/gameTypes";
import { RatingComponent } from "../ui/rating";
import { Button } from "../luxe/button";
import { Input } from "../luxe/input";
import { Textarea } from "../ui/textarea";
import { toast, Toaster } from "sonner";
import { createReview } from "@/services/apiService";

// Form Schema
const ReviewSchema = z.object({
  title: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(100, { message: "The field should have maximun 100 characters" }),
  content: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(1000, { message: "The field should have maximun 1000 characters" }),
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

  const [score, setScore] = useState<number>(userRating?.score || 0);
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

  const onSubmit = handleSubmit(async (data) => {
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
          <Button variant="default" className="cursor-pointer">
            Write a Review
          </Button>
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
              <form action="" className="mt-4 mb-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="text-base">
                    Title
                  </label>
                  <Input
                    type="text"
                    className="text-primary w-full"
                    defaultValue={userReview?.title}
                    {...register("title")}
                    style={{ color: "rgb(246 246 246)" }}
                  />
                  <span className="text-sm text-destructive">
                    {errors.title?.message}
                  </span>
                  <label htmlFor="content" className="text-base">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    defaultValue={userReview?.content}
                    variant="lg"
                    className="bg-main-secondary"
                  />
                  <span className="text-sm text-destructive">
                    {errors.content?.message}
                  </span>
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
              <Button onClick={onSubmit}>Review It</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogReviewComponent;
