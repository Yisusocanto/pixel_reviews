import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import useAlreadyAuth from "@/hooks/useAlreadyAuth";
// Components
import { Input, InputAddon, InputGroup } from "../ui/input";
import { DateField, DateInput } from "../ui/datefield";
import { AtSign, CalendarDays, Mail, Lock } from "lucide-react";
import AccentButton from "../commonsComponents/AccentButton";
import { Label, HelperText } from "flowbite-react";
// Services
import { useSignUp } from "@/hooks/fetching/auth/useSignUp";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .trim()
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters are allowed (no spaces).",
      }),
    lastname: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .trim()
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters are allowed (no spaces).",
      }),
    username: z
      .string()
      .min(4, { message: "Minimum 4 characters" })
      .max(20, { message: "Maximum 20 characters" })
      .trim()
      .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Only letters and numbers are allowed (no spaces).",
      }),
    email: z.email({ message: "invalid Email" }).trim(),
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

function SignUpForm() {
  useAlreadyAuth();

  const { mutate: signUpUser, isPending, isError, error } = useSignUp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    signUpUser(formData);
  });

  return (
    <div className="flex flex-col w-full shadow-4xl max-w-md">
      <h2 className="text-4xl text-center sm:text-start font-bold mb-2">
        Create an account
      </h2>
      <p className="text-primary-muted text-center sm:text-start mb-8">
        Join us to get started
      </p>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          {/* Name and Lastname */}
          <div className="flex justify-between gap-2">
            <div className="flex flex-col">
              <Label color={errors.name ? "failure" : "default"}>Name</Label>
              <Input
                type="text"
                variant="lg"
                {...register("name")}
                autoFocus
                placeholder="John"
              />
              <HelperText color="failure">{errors.name?.message}</HelperText>
            </div>
            <div className="flex flex-col">
              <Label color={errors.lastname ? "failure" : "default"}>
                Lastname
              </Label>
              <Input
                type="text"
                variant="lg"
                {...register("lastname")}
                placeholder="Doe"
              />
              <HelperText color="failure">
                {errors.lastname?.message}
              </HelperText>
            </div>
          </div>
          {/* Username */}
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
              />
            </InputGroup>
            <HelperText color="failure">{errors.username?.message}</HelperText>
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <Label color={errors.email ? "failure" : "default"}>Email</Label>
            <InputGroup>
              <InputAddon mode="icon" variant="lg">
                <Mail />
              </InputAddon>
              <Input
                type="text"
                variant="lg"
                {...register("email")}
                placeholder="johndoe@example.com"
              />
            </InputGroup>
            <HelperText color="failure">{errors.email?.message}</HelperText>
          </div>
          {/* Birthday */}
          <div className="flex flex-col">
            <Label color={errors.birthday ? "failure" : "default"}>
              Birthday
            </Label>
            <InputGroup>
              <InputAddon mode="icon" variant="lg">
                <CalendarDays />
              </InputAddon>
              <DateField
                aria-label="bithday"
                onChange={(value) => {
                  if (value) {
                    const formatted = value.toString();
                    setValue("birthday", formatted, { shouldValidate: true });
                  }
                }}
              >
                <DateInput variant="lg" />
              </DateField>
            </InputGroup>

            <HelperText color="failure">{errors.birthday?.message}</HelperText>
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
          <div className="flex flex-col">
            <Label color={errors.confirmPassword ? "failure" : "default"}>
              Confirm Password
            </Label>
            <InputGroup>
              <InputAddon mode="icon" variant="lg">
                <Lock />
              </InputAddon>
              <Input
                type="password"
                variant="lg"
                {...register("confirmPassword")}
                placeholder="**********"
              />
            </InputGroup>
            <HelperText color="failure">
              {errors.confirmPassword?.message}
            </HelperText>
          </div>
          <AccentButton disabled={isPending}>
            {isPending ? "Creating user..." : "Create user"}
          </AccentButton>
        </div>
      </form>
      <span className="text-destructive-secondary mt-2">
        {isError ? error.response.data.error : null}
      </span>
      <span className="text-center mt-4">
        Already have an account?
        <Link
          to="/auth/login"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Log in
        </Link>
      </span>
    </div>
  );
}

export default SignUpForm;
