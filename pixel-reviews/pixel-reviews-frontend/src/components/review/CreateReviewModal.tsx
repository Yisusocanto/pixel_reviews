"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Game, Rating, Review } from "@/types/gameTypes";
import {
  Modal,
  Label,
  Button,
  Form,
  TextField,
  FieldError,
  TextArea,
  Input,
} from "@heroui/react";
import { RatingComponent } from "../ui/rating";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  useCreateReview,
  useDeleteReview,
} from "@/hooks/fetching/reviews/useReview";
import { toast } from "sonner";
import { orbitron } from "@/fonts/fonts";
import axios from "axios";

const Schema = z.object({
  title: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(100, { message: "The field should have maximun 100 characters" }),
  content: z
    .string()
    .min(4, { message: "The field should have minimun 4 characters" })
    .max(3000, { message: "The field should have maximun 3000 characters" }),
});

interface CreateReviewModalProps {
  game: Game;
  userReview: Review | null;
  userRating: Rating | null;
}

const displaySuccessToast = (operation: string) => {
  toast.success(`Review ${operation}`, {
    description: `The review has been ${operation} successfully`,
    duration: 5000,
  });
};

const displayErrorToast = (error: string) => {
  toast.error("Error", {
    description: `Error: ${error}`,
    duration: 5000,
  });
};

function CreateReviewModal({
  game,
  userRating,
  userReview,
}: CreateReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [ratingError, setRatingError] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isEditing = !!userReview;

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue("title", userReview?.title || "");
      setValue("content", userReview?.content || "");
      setScore(userRating?.score || 0);
    }
  }, [isOpen, userReview, userRating, setValue]);

  const titleValue = watch("title") || "";
  const contentValue = watch("content") || "";

  const { mutate: createReview } = useCreateReview(game.slug);
  const { mutate: deleteReview } = useDeleteReview(game.slug);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error ?? "Unknown error";
    }
    return "Unknown error";
  };

  const onSubmit = handleSubmit((data) => {
    if (score === 0) {
      setRatingError("You must give a rating");
      return;
    }

    createReview(
      {
        gameID: game.gameID,
        reviewTitle: data.title,
        reviewContent: data.content,
        score: score,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          displaySuccessToast(isEditing ? "updated" : "created");
        },
        onError: (error) => {
          displayErrorToast(getErrorMessage(error));
        },
      }
    );
  });

  const handleDeleteReview = () => {
    if (!userReview) return;

    deleteReview(userReview.reviewID, {
      onSuccess: () => {
        setIsOpen(false);
        displaySuccessToast("deleted");
      },
      onError: (error) => {
        displayErrorToast(getErrorMessage(error));
      },
    });
  };

  const handleOpenModal = () => {
    if (isAuthenticated) {
      setIsOpen(true);
    } else {
      router.push("/login");
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Log in to write a review";
    return isEditing ? "Edit your review" : "Create a review";
  };

  const getSubmitButtonText = () => {
    return isEditing ? "Update" : "Create";
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button onPress={handleOpenModal}>{getButtonText()}</Button>
      <Modal.Container placement="center" variant="blur">
        <Modal.Dialog className="w-sm h-auto max">
          {({ close }) => (
            <>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>
                  {isEditing
                    ? "Edit your review"
                    : "Write a review for this game"}
                </Modal.Heading>
                <h2 className={`${orbitron.className} text-2xl font-bold`}>
                  {game.title}
                </h2>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <div>
                  <Label>Rating</Label>
                  <RatingComponent
                    size="lg"
                    rating={score}
                    editable
                    showValue
                    onRatingChange={setScore}
                  />
                  {ratingError && (
                    <span className="text-danger">{ratingError}</span>
                  )}
                </div>
                <Form onSubmit={onSubmit} id="create-review-form">
                  <TextField isInvalid={!!errors.title}>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={titleValue}
                      {...register("title")}
                    />
                    <div className="flex justify-between text-tiny text-default-400">
                      <FieldError>{errors.title?.message}</FieldError>
                      <span>{titleValue.length}/100</span>
                    </div>
                  </TextField>
                  <TextField isInvalid={!!errors.content}>
                    <Label>Content</Label>
                    <TextArea
                      value={contentValue}
                      {...register("content")}
                      className={"h-30"}
                    />
                    <div className="flex justify-between text-tiny text-default-400">
                      <FieldError>{errors.content?.message}</FieldError>
                      <span>{contentValue.length}/3000</span>
                    </div>
                  </TextField>
                </Form>
              </Modal.Body>
              <Modal.Footer className="flex justify-between">
                <Button variant="secondary" onPress={close}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {isEditing && (
                    <Button variant="danger" onPress={handleDeleteReview}>
                      Delete
                    </Button>
                  )}
                  <Button type="submit" form="create-review-form">
                    {getSubmitButtonText()}
                  </Button>
                </div>
              </Modal.Footer>
            </>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}

export default CreateReviewModal;
