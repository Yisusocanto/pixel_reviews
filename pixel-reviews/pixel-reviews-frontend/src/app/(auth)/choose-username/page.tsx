"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Label,
  Form,
  TextField,
  Input,
  Button,
  FieldError,
  Spinner,
  Description,
} from "@heroui/react";
import { useChangeUsername } from "@/hooks/fetching/settings/useProfileSettings";
import { useRouter } from "next/navigation";
import axios from "axios";

const Schema = z.object({
  username: z
    .string()
    .min(4, { message: "Minimum 4 characters" })
    .max(20, { message: "Maximum 20 characters" })
    .trim()
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
      message: "Only letters and numbers are allowed (no spaces)",
    }),
});

function page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(Schema) });

  const {
    mutate: changeUsername,
    isPending,
    isError,
    error,
  } = useChangeUsername();

  const onSubmit = handleSubmit((data) => {
    changeUsername(data.username, {
      onSuccess: () => {
        router.replace("/feed");
      },
    });
  });

  return (
    <Card className="flex flex-col gap-6 max-w-3/7 m-auto mt-40 py-10 px-14 border">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to the <strong className="text-accent">crew</strong>
        </h1>
        <p className="text-muted">
          Claim your unique username to start writing reviews and building your
          reputation in the Pixel Verse.
        </p>
      </div>
      <div className="flex-flex-col gap-4">
        <Form onSubmit={onSubmit}>
          <TextField isInvalid={!!errors.username} className={"mb-4"}>
            <Label>Username</Label>
            <Input {...register("username")} placeholder="e.g. Johndoe2026" />
            <Description>
              This is how you'll appear in reviews and how other users will see
              and find you.
            </Description>
            <FieldError>{errors.username?.message}</FieldError>
          </TextField>
          <Button fullWidth size="lg" type="submit">
            {isPending ? <Spinner color="current" /> : null}
            {isPending ? "Creating..." : "Create a username"}
          </Button>
        </Form>
        {isError && axios.isAxiosError(error) && (
          <p className="text-danger">{error.response?.data.error}</p>
        )}
      </div>
    </Card>
  );
}

export default page;
