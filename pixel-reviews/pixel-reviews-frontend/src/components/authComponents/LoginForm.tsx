import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
// Components
import { Label, HelperText } from "flowbite-react";
import { Lock, AtSign } from "lucide-react";
import { Input, InputAddon, InputGroup } from "../ui/input";
import AccentButton from "../commonsComponents/AccentButton";
// Services
import { login } from "@/services/authService";

// The loin schema for the validations
const loginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Minimum 4 characters" })
    .max(20, { message: "Maximum 20 characters" })
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
      message: "Only letters and numbers are allowed",
    }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

function LoginForm() {
  useAlreadyAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const { setActiveSession, setUserData } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // hnadle of the api call
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await login(data);
      setActiveSession(true);
      setUserData(response.data.user_data);
      navigate("/");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Unknown error");
    }
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
              />
            </InputGroup>
            <HelperText color="failure">{errors.password?.message}</HelperText>
          </div>
          <AccentButton>Login</AccentButton>
        </div>
      </form>
      <p className="mt-2 text-red-500">{errorMessage}</p>
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
