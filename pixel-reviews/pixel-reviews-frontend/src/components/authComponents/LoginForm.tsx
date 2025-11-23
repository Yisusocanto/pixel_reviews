import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
// Components
import { Label, HelperText } from "flowbite-react";
import { Lock, AtSign } from "lucide-react";
import { Input, InputAddon, InputGroup } from "../ui/input";
import AccentButton from "../commonsComponents/AccentButton";
// Services
import { useLogin } from "@/hooks/fetching/auth/useLogin";

const loginSchema = z.object({
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
  useAlreadyAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginUser, isPending, isError, error } = useLogin();

  const onSubmit = handleSubmit(async (formData) => {
    loginUser(formData);
  });

  return (
    <div className="flex flex-col shadow-4xl max-w-sm w-full">
      <h2 className="text-4xl font-bold mb-2">Welcome Back!</h2>
      <p className="text-primary-muted mb-8">Let's log in to continue</p>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Label color={errors.username ? "failure" : "default"}>
              Username
            </Label>
            <InputGroup>
              <InputAddon mode="icon" variant="lg">
                <AtSign />
              </InputAddon>
              <Input
                type="text"
                variant="lg"
                {...register("username")}
                placeholder="johndoe1234"
                autoFocus
                disabled={isPending}
              />
            </InputGroup>
            <HelperText color="failure">{errors.username?.message}</HelperText>
          </div>
          <div className="flex flex-col">
            <Label color={errors.password ? "failure" : "default"}>
              Password
            </Label>
            <InputGroup>
              <InputAddon mode="icon" variant="lg">
                <Lock />
              </InputAddon>
              <Input
                type="password"
                variant="lg"
                {...register("password")}
                placeholder="**********"
                disabled={isPending}
              />
            </InputGroup>
            <HelperText color="failure">{errors.password?.message}</HelperText>
          </div>
          <AccentButton disabled={isPending}>
            {isPending ? "Logging in..." : "Log in"}
          </AccentButton>
        </div>
      </form>
      <p className="mt-2 text-destructive-secondary">
        {isError ? (error as any).response.data.error : null}
      </p>
      <span className="flex justify-center gap-2 mt-4 ">
        Don't have an account?
        <Link
          to="/auth/signup"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
      </span>
      <span className="text-white text-center mt-4 ">
        <Link
          to="/auth/password_recovery"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </span>
    </div>
  );
}

export default LoginForm;
