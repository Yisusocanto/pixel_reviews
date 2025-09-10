import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAlreadyAuth from "../../hooks/useAlreadyAuth";

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
  const [errorMessage, settErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const response = await login(data);
    if (response.state) {
      navigate("/prueba");
    } else {
      settErrorMessage(response.message);
    }
  });

  useAlreadyAuth("/prueba");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
        <button>Login</button>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
}

export default LoginForm;
