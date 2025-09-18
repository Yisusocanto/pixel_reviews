import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
import { useAuth } from "@/context/AuthContextProvider";

//icons
import UsernameIcon from "@/components/iconsComponents/UsernameIcon";
import LockIcon from "@/components/iconsComponents/LockIcon";
import EmailIcon from "@/components/iconsComponents/EmailIcon";

//flowbite components
import {
  TextInput,
  Label,
  HelperText,
  Button,
  Datepicker,
} from "flowbite-react";

//Form validation scheme
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters are allowed",
      }),
    lastname: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters are allowed",
      }),
    username: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters and numbers are allowed",
      }),
    email: z.email({ message: "invalid Email" }),
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
    birthday: z.string(),
  }) //check if both passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }) //Verify that the date of birth is equal to or greater than 14
  .refine(
    (data) => {
      const birthday = new Date(data.birthday);
      const actualDate = new Date();
      const age = actualDate.getFullYear() - birthday.getFullYear();
      return age >= 14;
    },
    {
      message: "You must be at least 14 years old",
      path: ["birthday"],
    }
  );

//the start of the component
function SignUpForm() {
  useAlreadyAuth();
  const [errorMessage, setErrormessage] = useState("");
  const navigate = useNavigate();
  const { setActiveSession, setUserData } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Sends the data to the backend, if there is an error it saves it in the state or if the user creation is successful it redirects
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signUp(data);
      setActiveSession(true);
      setUserData(response.data.user_data);
      navigate("/");
    } catch (error: any) {
      setErrormessage(error.response?.data?.message || "Error desconocido");
    }
  });

  return (
    <div className="w-full shadow-4xl max-w-md">
      <h2 className="text-4xl text-white font-bold mb-2">Create an account</h2>
      <p className="text-gray-400 mb-8">Join us to get started</p>
      <form onSubmit={onSubmit}>
        <div className="grid-cols-2 grid gap-4">
          <div>
            <Label color={errors.name ? "failure" : "default"}>Name</Label>
            <TextInput
              type="text"
              {...register("name")}
              className=""
              placeholder="John"
              autoFocus
            />
            <HelperText color="failure">{errors.name?.message}</HelperText>
          </div>
          <div>
            <Label color={errors.lastname ? "failure" : "default"}>
              Lastname
            </Label>
            <TextInput
              type="text"
              {...register("lastname")}
              className=""
              placeholder="Doe"
            />
            <HelperText color="failure">{errors.lastname?.message}</HelperText>
          </div>
        </div>
        <div className="mt-3">
          <Label color={errors.username ? "failure" : "default"}>
            Username
          </Label>
          <TextInput
            type="text"
            {...register("username")}
            className=""
            placeholder="johndoe1234"
            icon={UsernameIcon}
          />
          <HelperText color="failure">{errors.username?.message}</HelperText>
        </div>
        <div className="mt-3">
          <Label color={errors.email ? "failure" : "default"}>Email</Label>
          <TextInput
            type="email"
            {...register("email")}
            className=""
            placeholder="johndoe@example.com"
            icon={EmailIcon}
          />
          <HelperText color="failure">{errors.email?.message}</HelperText>
        </div>

        <div className="mt-3">
          <Label color={errors.birthday ? "failure" : "default"}>
            Birthday
          </Label>
          <Datepicker
            onChange={(value) => {
              if (value) {
                // Formatea la fecha a YYYY-MM-DD
                const formatted = value.toISOString().split("T")[0];
                setValue("birthday", formatted, { shouldValidate: true });
              }
            }}
          />
          <HelperText color="failure">{errors.birthday?.message}</HelperText>
        </div>

        <div className="mt-3">
          <Label color={errors.password ? "failure" : "default"}>
            Password
          </Label>
          <TextInput
            type="password"
            {...register("password")}
            className=""
            placeholder="**********"
            icon={LockIcon}
          />
          <HelperText color="failure">{errors.password?.message}</HelperText>
        </div>
        <div className="mt-3">
          <Label color={errors.confirmPassword ? "failure" : "default"}>
            Confirm Password
          </Label>
          <TextInput
            type="password"
            {...register("confirmPassword")}
            className=""
            placeholder="**********"
            icon={LockIcon}
          />
          <HelperText color="failure">
            {errors.confirmPassword?.message}
          </HelperText>
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800 w-full mt-5"
        >
          Create User
        </Button>
      </form>
      <p className="text-red-500 mt-2">{errorMessage}</p>
      <p className="text-white text-center mt-4">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignUpForm;
