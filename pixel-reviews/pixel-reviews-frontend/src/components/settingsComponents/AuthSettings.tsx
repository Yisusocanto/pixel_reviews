import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { toast, Toaster } from "sonner";
import { Input } from "../luxe/input";
import { Button } from "../luxe/button";
import { HelperText } from "flowbite-react";
import { LockIcon, Save } from "lucide-react";
import SpinnerComponent from "../commonsComponents/SpinnerComponent";

// Services
import { changePassword } from "@/services/settingService";

const AuthSettingsSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters" })
      .regex(/^(?=.*[0-9])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Must contain at least one number and only letters or numbers",
      }),
    newPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters" })
      .regex(/^(?=.*[0-9])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Must contain at least one number and only letters or numbers",
      }),
    confirmNewPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters" })
      .regex(/^(?=.*[0-9])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Must contain at least one number and only letters or numbers",
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function AuthSettings() {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(AuthSettingsSchema) });

  // Success toast
  const displaySuccessToast = () =>
    toast.success("Password changed", {
      description: "The Password has been changed successfully",
      duration: 5000,
    });

  // Success toast
  const displayErrorToast = (error: string) =>
    toast.error("Error", {
      description: `Error changing the password: ${error}`,
      duration: 5000,
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await changePassword(data.currentPassword, data.newPassword);
      displaySuccessToast();
      setValue("confirmNewPassword", "");
      setValue("currentPassword", "");
      setValue("newPassword", "");
    } catch (error: any) {
      displayErrorToast(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  });
  return (
    <div>
      <Toaster theme="dark" richColors={true} />
      {loading && <SpinnerComponent />}
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex gap-2 items-center">
            <LockIcon size={18} />
            <h4 className="text-lg">Change Password</h4>
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentPassword">Current Password</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              type="password"
              {...register("currentPassword")}
              className="w-full"
            />
            {errors.currentPassword && (
              <HelperText color="failure">
                {errors.currentPassword?.message}
              </HelperText>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentPassword">New Password</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              type="password"
              {...register("newPassword")}
              className="w-full"
            />
            {errors.newPassword ? (
              <HelperText color="failure">
                {errors.newPassword?.message}
              </HelperText>
            ) : (
              <HelperText color="gray">
                It must contain at least 6 characters, only letters and numbers,
                and at least one number
              </HelperText>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentPassword">Confirm New Password</label>
            <Input
              style={{ color: "rgb(246 246 246)" }}
              type="password"
              {...register("confirmNewPassword")}
              className="w-full"
            />
            {errors.confirmNewPassword && (
              <HelperText color="failure">
                {errors.confirmNewPassword?.message}
              </HelperText>
            )}
          </div>
          <div className="flex">
            <Button className="flex gap-2 items-center">
              <Save size={16} />
              <span>Change Password</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AuthSettings;
