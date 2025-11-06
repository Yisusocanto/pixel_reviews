import LoginForm from "../components/authComponents/LoginForm";
import { Card } from "@/components/luxe/card";
import logo from "@/assets/logo.png";

function LoginPage() {
  return (
    <div className="p-6 mt-10 md:mt-15">
      <Card
        className="w-full max-w-4xl rounded-2xl flex flex-col md:flex-row mx-auto p-6 md:p-8 gap-6 md:gap-8"
        variant="shine"
      >
        <div className="my-auto flex-1 text-center lg:text-left w-3xs">
          <img
            src={logo}
            alt="website's logo"
            className="m-auto w-20 h-20 md:w-30 md:h-30"
          />
          <h1 className="text-3xl text-white text-center font-bold mb-2">
            We are very happy to have you back
          </h1>
          <p className="text-base text-gray-400 text-center">
            Sign in and start sharing your opinions on you favorite video games.
          </p>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
