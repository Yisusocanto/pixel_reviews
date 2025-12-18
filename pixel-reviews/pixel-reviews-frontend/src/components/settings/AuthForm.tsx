"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, Save } from "lucide-react";
import {
  Button,
  Form,
  Input,
  TextField,
  FieldError,
  Label,
  Description,
  Spinner,
} from "@heroui/react";
import { useAuthSettings } from "@/hooks/fetching/settings/useAuthSettings";

const Schema = z
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
    path: ["confirmNewPassword"],
  });

function AuthForm() {
  const { mutate: changePassword, isPending } = useAuthSettings();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(Schema) });

  const onSubmit = handleSubmit(async (data) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  });
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 px-1 md:px-4">
          <div className="flex gap-2 items-center">
            <LockIcon size={18} />
            <h1 className="text-lg">Change Password</h1>
          </div>
          <TextField
            className="flex flex-col"
            isInvalid={!!errors.currentPassword}
          >
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input type="password" {...register("currentPassword")} />
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </TextField>
          <TextField className="flex flex-col" isInvalid={!!errors.newPassword}>
            <Label htmlFor="currentPassword">New Password</Label>
            <Input type="password" {...register("newPassword")} />
            <Description>
              It must contain at least 6 characters, only letters and numbers,
              and at least one number
            </Description>
            <FieldError>{errors.newPassword?.message}</FieldError>
          </TextField>
          <TextField
            className="flex flex-col"
            isInvalid={!!errors.confirmNewPassword}
          >
            <Label htmlFor="currentPassword">Confirm New Password</Label>
            <Input type="password" {...register("confirmNewPassword")} />
            <FieldError>{errors.confirmNewPassword?.message}</FieldError>
          </TextField>
          <div className="flex">
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
              {isPending ? "Changing..." : "Change password"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AuthForm;
