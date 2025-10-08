import SignUpForm from "../components/authComponents/SignUpForm";
import { Card } from "@/components/luxe/card";

function SignUpPage() {
  return (
    <div className="p-6 mt-5 md:mt-15">
      <Card className="bg-(--accent-color) w-full max-w-4xl mx-auto rounded-2xl flex flex-col md:flex-row  p-6 md:p-8 gap-6 md:gap-8" variant="shine">
      <div className="flex-1 my-auto text-center lg:text-left">
        <h1 className="text-white text-3xl font-bold mb-2 text-center">Welcome aboard</h1>
        <p className="text-gray-400 text-base mb-2 hidden md:visible">
          Create an accouunt and discover a whole new world of possibilities.
        </p>
        <p className="text-gray-400 text-base">
          Join our community and start sharing your thoughts on video games
          with other gamers like you.
        </p>
      </div>
      <div className="flex-1">
        <SignUpForm />
      </div>
    </Card>
    </div>
  );
}

export default SignUpPage;
