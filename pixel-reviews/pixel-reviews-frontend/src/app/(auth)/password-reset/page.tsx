"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordReset } from "@/services/authService";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  Label,
  TextField,
  Input,
  FieldError,
  Button,
  Card,
  Spinner,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const Schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Minimum 6 characters" })
      .regex(/^(?=.*[0-9])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Must contain at least one number and only letters or numbers",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters" })
      .regex(/^(?=.*[0-9])[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Must contain at least one number and only letters or numbers",
      }),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(Schema) });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      resetToken,
      newPassword,
    }: {
      resetToken: string;
      newPassword: string;
    }) => passwordReset(resetToken, newPassword),
    onSuccess: () => {
      router.replace("/login");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const token = searchParams.get("token");
    mutate({ resetToken: token ?? "", newPassword: data.password });
  });

  return (
    <div>
      <div className="w-xs sm:w-sm md:w-md m-auto mt-30">
        <Card className="flex flex-col px-10 py-5 gap-5">
          <h1 className="text-center text-3xl fonnt-bold">New password</h1>
          <Form onSubmit={onSubmit} className="flex flex-col">
            <TextField isInvalid={!!errors.password}>
              <Label className="text-lg" htmlFor="password">
                Password
              </Label>
              <Input
                type="text"
                {...register("password")}
                placeholder="**********"
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>

            <TextField isInvalid={!!errors.confirmPassword}>
              <Label className="text-lg" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                type="text"
                {...register("confirmPassword")}
                placeholder="**********"
              />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </TextField>

            <Button className="mt-4" isPending={isPending} type="submit">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" /> : null}{" "}
                  {isPending ? "Creating..." : "Create new password"}
                </>
              )}
            </Button>
          </Form>
        </Card>
        <span className="text-danger">
          {isError && axios.isAxiosError(error)
            ? error.response?.data.error
            : null}
        </span>
      </div>
    </div>
  );
}

export default page;
