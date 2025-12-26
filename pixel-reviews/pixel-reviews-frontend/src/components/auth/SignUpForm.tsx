"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/fetching/auth/useSignUp";
import { useAuth } from "@/providers/AuthProvider";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Button,
  Checkbox,
  Spinner,
} from "@heroui/react";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .trim()
      .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters and numbers are allowed (no spaces).",
      }),
    email: z.email({ message: "invalid Email" }).trim(),
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
    age: z.boolean().refine((val) => val === true, {
      message: "You must be 13 years or older.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUpForm() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: false,
    },
  });

  const { mutate: signUp, isPending, isError, error } = useSignUp();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, router]);

  const onSubmit = handleSubmit(async (data) => {
    signUp(data);
  });

  return (
    <div className="flex flex-col shadow-4xl max-w-sm w-full">
      <h2 className="text-4xl font-bold mb-2">Create Account</h2>
      <p className="text-muted mb-8">Join us to get started</p>

      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired isInvalid={!!errors.username}>
          <Label>Username</Label>
          <Input
            type="text"
            {...register("username")}
            placeholder="johndoe123"
          />
          <FieldError>{errors.username?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.email}>
          <Label>Email</Label>
          <Input
            type="text"
            {...register("email")}
            placeholder="john@example.com"
          />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.password}>
          <Label>Password</Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Create a password"
          />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.confirmPassword}>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm your password"
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </TextField>
        <TextField className="flex gap-2" isRequired isInvalid={!!errors.age}>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <Checkbox id="age" isSelected={value} onChange={onChange}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              )}
            />
            <Label htmlFor="age">I am 13 years of age or older</Label>
          </div>
          <FieldError>{errors.age?.message}</FieldError>
        </TextField>

        <Button type="submit" className="w-full mt-2" isPending={isPending}>
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" /> : null}
              {isPending ? "Loging in..." : "Log In"}
            </>
          )}
        </Button>
        <Button
          onPress={() =>
            (window.location.href = `${BACKEND_URL}/auth/google/login`)
          }
          fullWidth
          variant="tertiary"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>
      </Form>

      <p className="mt-2 text-danger text-center">
        {isError && (error as any).response?.data
          ? (error as any).response.data.error
          : null}
      </p>

      <span className="flex justify-center gap-2 mt-4">
        Already have an account?
        <Link
          href="/login"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Log In
        </Link>
      </span>
    </div>
  );
}

export default SignUpForm;
