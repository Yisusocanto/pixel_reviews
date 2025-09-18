import SignUpForm from "../components/authComponents/SignUpForm";

function SignUpPage() {
  return (
    <div className="bg-(--accent-color) w-full max-w-4xl mx-auto rounded-2xl flex flex-col md:flex-row mt-15 p-6 md:p-8 gap-6 md:gap-8">
      <div className="flex-1 my-auto text-center lg:text-left">
        <h1 className="text-white text-3xl font-bold mb-2 text-center">Welcome aboard</h1>
        <p className="text-gray-400 text-base mb-2">
          Create an accouunt and discover a whole new world of possibilities.
        </p>
        <p className="text-gray-400 text-base">
          Join our community and strat sharing yourr thoughts on video games
          with other gamers like you.
        </p>
      </div>
      <div className="flex-1">
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
