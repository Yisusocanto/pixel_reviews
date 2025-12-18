"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/fetching/auth/useLogin";
import { useAuth } from "@/providers/AuthProvider";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Button,
  Spinner,
} from "@heroui/react";

const Schema = z.object({
  username: z
    .string()
    .min(4, { message: "Minimum 4 characters" })
    .max(20, { message: "Maximum 20 characters" })
    .trim()
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
      message: "Only letters and numbers are allowed (no spaces)",
    }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

function LoginForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router]);

  const { mutate: login, isPending, isError, error } = useLogin();

  const onSubmit = handleSubmit(async (data) => {
    login(data);
  });

  return (
    <div className="flex flex-col shadow-4xl max-w-sm w-full">
      <h2 className="text-4xl font-bold mb-2">Welcome Back!</h2>
      <p className="text-muted mb-8">Let's log in to continue</p>
      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired isInvalid={!!errors.username}>
          <Label>Username</Label>
          <Input
            type="text"
            {...register("username")}
            placeholder="johndoe1234"
          />
          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.password}>
          <Label>Password</Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <Button type="submit" className="w-full" isPending={isPending}>
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" /> : null}
              {isPending ? "Loging in..." : "Log In"}
            </>
          )}
        </Button>
      </Form>
      <p className="mt-2 text-danger">
        {isError && (error as any).response.data
          ? (error as any).response.data.error
          : null}
      </p>
      <span className="flex justify-center gap-2 mt-4 ">
        Don't have an account?
        <Link
          href="/signup"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
      </span>
      <span className="text-center mt-4 ">
        <Link
          href="/password-recovery"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </span>
    </div>
  );
}

export default LoginForm;
