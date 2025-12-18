"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Spinner } from "@heroui/react";
import {
  Separator,
  Button,
  Form,
  TextField,
  FieldError,
  Label,
  TextArea,
} from "@heroui/react";
import { Save } from "lucide-react";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
import { useProfileSettings } from "@/hooks/fetching/settings/useProfileSettings";
import { useEffect } from "react";
import type { User } from "@/types/userTypes";

const Schema = z.object({
  location: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z
      .string()
      .min(4, { message: "Minimun 4 characters" })
      .max(40, { message: "Maximun 40 characters" })
      .optional()
  ),
  bio: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z
      .string()
      .min(20, { message: "Minimun 20 characters" })
      .max(500, { message: "Maximun 500 characters" })
      .optional()
  ),
  website: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z
      .string()
      .url({ message: "Invalid URL" })
      .min(4, { message: "Minimun 4 characters" })
      .max(100, { message: "Maximun 100 characters" })
      .optional()
  ),
});

interface ProfileFormProps {
  user?: User;
}

function ProfileForm({ user }: ProfileFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      location: user?.location ?? "",
      bio: user?.bio ?? "",
      website: user?.website ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        location: user.location ?? "",
        bio: user.bio ?? "",
        website: user.website ?? "",
      });
    }
  }, [user, reset]);

  const bioInput = useCharacterLimit(500, user?.bio ?? "");

  const { mutate: updateUserProfile, isPending } = useProfileSettings();

  const onSubmit = handleSubmit(async (data) => {
    updateUserProfile({
      location: data.location ?? "",
      bio: data.bio ?? "",
      website: data.website ?? "",
    });
  });

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 px-1 md:px-4">
          {/* Location input */}
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <TextField
                className="flex flex-col"
                isInvalid={!!errors.location}
              >
                <Label htmlFor="location">Location</Label>
                <Input
                  type="text"
                  placeholder={user?.location ? "" : "Caracas, Venezuela"}
                  {...field}
                  value={field.value?.toString() ?? ""}
                />
                <FieldError>{errors.location?.message}</FieldError>
              </TextField>
            )}
          />

          {/* Bio input */}
          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <TextField className="flex flex-col" isInvalid={!!errors.bio}>
                <Label htmlFor="bio">Biography</Label>
                <TextArea
                  className={"h-30"}
                  maxLength={bioInput.maxLength}
                  {...field}
                  value={field.value?.toString() ?? ""}
                  onChange={(e) => {
                    field.onChange(e);
                    bioInput.handleChange(e.target.value);
                  }}
                />
                <div className="flex  justify-between">
                  <FieldError>{errors.bio?.message}</FieldError>
                  <span>
                    {bioInput.characterCount}/{bioInput.maxLength}
                  </span>
                </div>
              </TextField>
            )}
          />

          {/* Website input */}
          <Controller
            control={control}
            name="website"
            render={({ field }) => (
              <TextField className="flex flex-col" isInvalid={!!errors.website}>
                <Label htmlFor="website">Website</Label>
                <Input
                  type="text"
                  placeholder={user?.website ? "" : "www.mywebsite.com"}
                  {...field}
                  value={field.value?.toString() ?? ""}
                />
                <FieldError>{errors.website?.message}</FieldError>
              </TextField>
            )}
          />
          <Separator />
          <div className="flex justify-end ">
            <Button
              className="flex gap-2 items-center"
              type="submit"
              isPending={isPending}
            >
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <Save size={16} />
              )}
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ProfileForm;
