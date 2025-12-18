"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRecovery } from "@/services/authService";
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
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const Schema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

function page() {
  const { isAuthenticated } = useAuth();
  const [emailSended, setEmailSended] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(Schema) });

  useEffect(() => {
    if (isAuthenticated) router.replace("/feed");
  }, [isAuthenticated, router]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (email: string) => passwordRecovery(email),
    onSuccess: () => {
      setEmailSended(true);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate(data.email);
  });

  if (isError && !(error as any).response) {
    throw error;
  }

  if (emailSended) {
    return (
      <div className="flex items-center mt-40 w-md m-auto">
        <p className="text-2xl font-bold text-justify">
          A link to recover your password was sent to the email you specified.
          Please check your inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-xs sm:w-sm md:w-md m-auto mt-30">
        <Card className="flex flex-col px-10 py-5 gap-5">
          <h1 className="text-center text-3xl font-bold">Password recovery</h1>
          <p className="text-sm text-justify">
            We will send you an email with your username and a link to recover
            your password to the email address you provide below.
          </p>
          <Form onSubmit={onSubmit} className="flex flex-col mt-4 gap-1">
            <TextField isInvalid={!!errors.email}>
              <Label htmlFor="email" className="text-lg">
                Email address
              </Label>
              <Input {...register("email")} placeholder="johndoe@example.com" />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>
            <Button className="mt-4" isPending={isPending} type="submit">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" /> : null}
                  {isPending ? "Loging in..." : "Log In"}
                </>
              )}
            </Button>
          </Form>
        </Card>
        <span className="text-danger">
          {isError && (error as any).response
            ? (error as any).response.data.error
            : null}
        </span>
      </div>
    </div>
  );
}

export default page;
