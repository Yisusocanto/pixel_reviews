import LoginForm from "../components/authComponents/LoginForm";

function LoginPage() {
  return (
    <div className="bg-(--accent-color) w-full max-w-4xl rounded-2xl flex flex-col md:flex-row mt-20 mx-auto p-6 md:p-8 gap-6 md:gap-8">
      <div className="my-auto flex-1 text-center lg:text-left">
        <h1 className="text-exl text-white text-center font-bold mb-2">We are very happy to have you back</h1>
        <p className="text-base text-gray-400">
          Sign in and start sharing your opinions on you favorite video games.
        </p>
      </div>
      <div className="flex-1 flex justify-center lg:justify-end">
        <LoginForm />
      </div>
      
    </div>
  );
}

export default LoginPage;
