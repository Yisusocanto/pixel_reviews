import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/authService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
import { Label, TextInput, Button, HelperText } from "flowbite-react";

// Icons
import UsernameIcon from "@/components/iconsComponents/UsernameIcon";
import LockIcon from "@/components/iconsComponents/LockIcon";

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
      setErrorMessage(error.response?.data?.message || "error desconocido");
    }
  });

  return (
    <div className="shadow-4xl max-w-sm w-full">
      <h2 className="text-4xl text-white font-bold mb-2">Welcome Back!</h2>
      <p className="text-gray-400 mb-8">Let's log in to continue</p>

      <form onSubmit={onSubmit}>
        <Label color={errors.username ? "failure" : "default"}>Username</Label>
        <TextInput
          {...register("username")}
          type="text"
          shadow
          placeholder="johndoe1234"
          icon={UsernameIcon}
          autoFocus
        />
        <HelperText className="mb-5" color="failure">
          {errors.username?.message}
        </HelperText>
        <Label
          className="mt-10"
          color={errors.password ? "failure" : "default"}
        >
          Password
        </Label>
        <TextInput
          {...register("password")}
          type="password"
          shadow
          placeholder="**********"
          icon={LockIcon}
        />
        <HelperText className="mb-5" color="failure">
          {errors.password?.message}
        </HelperText>
        <Button
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 w-full"
          type="submit"
        >
          Login
        </Button>
      </form>
      <p className="mt-2 text-red-500">{errorMessage}</p>
      <p className="text-white text-center mt-4 ">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
