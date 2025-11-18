import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRecovery } from "@/services/authService";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
import { Card } from "@/components/luxe/card";
import { Input } from "@/components/luxe/input";
import { Button } from "@/components/luxe/button";
import { HelperText } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";

const PasswordRecoverySchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

function PasswordRecovery() {
  useAlreadyAuth();
  const [emailSended, setEmailSended] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(PasswordRecoverySchema) });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (email: string) => passwordRecovery(email),
    onSuccess: () => {
      setEmailSended(true);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate(data.email);
  });

  if (isError && !error.response) {
    return <h1>Internal server error.</h1>;
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
        <Card
          variant="revealed-pointer"
          className="flex flex-col px-10 py-5 gap-5"
        >
          <h1 className="text-center text-3xl font-bold">Password recovery</h1>
          <p className="text-sm text-justify">
            We will send you an email with your username and a link to recover
            your password to the email address you provide below.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col mt-4 gap-1">
            <label htmlFor="email" className="text-lg">
              Email address
            </label>
            <Input
              {...register("email")}
              className="w-full"
              style={{ color: "rgb(246 246 246)" }}
              placeholder="johndoe@example.com"
            />
            <HelperText color="failure">
              {errors ? errors.email?.message : null}
            </HelperText>
            <Button className="mt-4" disabled={isPending}>
              {isPending ? "Sending email..." : "Send email"}
            </Button>
          </form>
        </Card>
        <span className="text-destructive">
          {isError ? error.response.data.error : null}
        </span>
      </div>
    </div>
  );
}

export default PasswordRecovery;
