import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { passwordReset } from "@/services/authService";
import { Card } from "@/components/luxe/card";
import { Input } from "@/components/luxe/input";
import { HelperText } from "flowbite-react";
import { Button } from "@/components/luxe/button";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";

const PasswordResetSchema = z
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

function PasswordReset() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searhcParms] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(PasswordResetSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const token = searhcParms.get("token");
      await passwordReset(token || "", data.password);
      navigate("/auth/login");
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div>
      <div className="w-md m-auto mt-30">
        <Card
          variant="revealed-pointer"
          className="flex flex-col px-10 py-5 gap-5"
        >
          <h1 className="text-center text-3xl fonnt-bold">New password</h1>
          <form onSubmit={onSubmit} className="flex flex-col">
            <label className="text-lg" htmlFor="password">
              Password
            </label>
            <Input
              type="text"
              {...register("password")}
              style={{ color: "rgb(246 246 246)" }}
              placeholder="**********"
              className="w-full"
            />
            <HelperText color="failure" className="mb-4">
              {errors.password?.message}
            </HelperText>
            <label className="text-lg" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              type="text"
              {...register("confirmPassword")}
              style={{ color: "rgb(246 246 246)" }}
              placeholder="**********"
              className="w-full"
            />
            <HelperText color="failure">
              {errors.confirmPassword?.message}
            </HelperText>

            <Button className="mt-4">Create new password</Button>
          </form>
        </Card>
        <span className="text-destructive">{errorMessage}</span>
        {loading && (
          <div className="z-50">
            <SpinnerComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
