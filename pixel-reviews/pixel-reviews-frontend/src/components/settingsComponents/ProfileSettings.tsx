import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContextProvider";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
// Components
import { Input } from "../luxe/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import SpinnerComponent from "../commonsComponents/SpinnerComponent";
import { HelperText } from "flowbite-react";
import { toast, Toaster } from "sonner";
import { Save } from "lucide-react";
import AccentButton from "../commonsComponents/AccentButton";
// Services
import { updateProfile } from "@/services/settingService";
// Types
import type { User } from "@/types/userTypes";

const ProfileSettingsSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Minimum 4 characters" })
    .max(20, { message: "Maximum 20 characters" })
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
      message: "Only letters are allowed (no spaces).",
    }),
  lastname: z
    .string()
    .min(4, { message: "Minimum 4 characters" })
    .max(20, { message: "Maximum 20 characters" })
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
      message: "Only letters are allowed (no spaces).",
    }),
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

interface ProfileSettingsProps {
  user?: User;
}

function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserData } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      lastname: user?.lastname ?? "",
      location: user?.location ?? "",
      bio: user?.bio ?? "",
      website: user?.website ?? "",
    },
  });

  // Success toast
  const displaySuccessToast = () =>
    toast.success("Profile updated", {
      description: "The Profile has been edited successfully",
      duration: 5000,
    });

  // Success toast
  const displayErrorToast = (error: string) =>
    toast.error("Error", {
      description: `Error updating the review: ${error}`,
      duration: 5000,
    });

  // Individual characterLimit hook's instances for each input
  const locationInput = useCharacterLimit(40, user?.location ?? "");
  const bioInput = useCharacterLimit(500, user?.bio ?? "");
  const websiteInput = useCharacterLimit(100, user?.website ?? "");

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const response = await updateProfile(
        data.name,
        data.lastname,
        data.location || "",
        data.bio || "",
        data.website || ""
      );
      const user = response?.data?.user;
      setUserData(user);
      displaySuccessToast();
      setIsDisabled(true);
    } catch (error: any) {
      displayErrorToast(error?.response?.data?.error ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div>
      <Toaster theme="dark" richColors={true} />
      {loading && <SpinnerComponent />}
      <form onSubmit={onSubmit} onChange={() => setIsDisabled(false)}>
        <div className="flex flex-col gap-4 px-1 md:px-4">
          {/* Name input */}
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              className="w-full"
              type="text"
              defaultValue={user?.name}
              {...register("name")}
            />
            {errors.name && (
              <HelperText color="failure">{errors.name?.message}</HelperText>
            )}
          </div>
          {/* Lastname input */}
          <div className="flex flex-col">
            <label htmlFor="lastname">Lastname</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              className="w-full"
              type="text"
              defaultValue={user?.lastname}
              {...register("lastname")}
            />
            {errors.lastname && (
              <HelperText color="failure">
                {errors.lastname?.message}
              </HelperText>
            )}
          </div>
          {/* Location input */}
          <div className="flex flex-col">
            <label htmlFor="location">Location</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              className="w-full"
              type="text"
              placeholder={user?.location ? "" : "Caracas, Venezuela"}
              maxLength={locationInput.maxLength}
              {...register("location", {
                onChange: (e) => locationInput.handleChange(e.target.value),
              })}
            />
            <div className="flex justify-between">
              <HelperText color="failure">
                {errors.location?.message}
              </HelperText>
              <HelperText>
                {locationInput.characterCount}/{locationInput.maxLength}
              </HelperText>
            </div>
          </div>
          {/* Bio input */}
          <div className="flex flex-col">
            <label htmlFor="bio">Biography</label>
            <Textarea
              className="bg-main-secondary"
              {...register("bio", {
                onChange: (e) => bioInput.handleChange(e.target.value),
              })}
              defaultValue={user?.bio}
              variant="lg"
              maxLength={bioInput.maxLength}
            />
            <div className="flex justify-between">
              <HelperText color="failure">{errors.bio?.message}</HelperText>
              <HelperText>
                {bioInput.characterCount}/{bioInput.maxLength}
              </HelperText>
            </div>
          </div>
          {/* Website input */}
          <div className="flex flex-col">
            <label htmlFor="website">Website</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              className="w-full"
              type="text"
              placeholder={user?.website ? "" : "www.mywebsite.com"}
              defaultValue={user?.website}
              maxLength={websiteInput.maxLength}
              {...register("website", {
                onChange: (e) => websiteInput.handleChange(e.target.value),
              })}
            />
            <div className="flex justify-between">
              <HelperText color="failure">{errors.website?.message}</HelperText>
              <HelperText>
                {websiteInput.characterCount}/{websiteInput.maxLength}
              </HelperText>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end ">
            <AccentButton
              disabled={isDisabled}
              className="flex gap-2 items-center"
            >
              <Save size={16} />
              <span className="text-base">Save changes</span>
            </AccentButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
