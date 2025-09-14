import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "../../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAlreadyAuth from "../../hooks/useAlreadyAuth";
import { useAuth } from "../../context/AuthContextProvider";

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
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
        <label htmlFor="lastname">Lastname</label>
        <input type="text" {...register("lastname")} />
        {errors.lastname && <span>{errors.lastname.message}</span>}
        <label htmlFor="username">Username</label>
        <input type="text" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}\
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <label htmlFor="birthday">Birthday</label>
        <input type="date" {...register("birthday")} />
        {errors.birthday && <span>{errors.birthday.message}</span>}
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span>{errors.confirmPassword.message}</span>
        )}
        <button>Create user</button>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
}

export default SignUpForm;
