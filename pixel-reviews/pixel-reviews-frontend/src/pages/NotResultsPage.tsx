import { Link } from "react-router-dom";
// Components
import { Button } from "@/components/luxe/button";

interface NotResultsPageProps {
  gameTitle: string;
}

function NotResultsPage({ gameTitle }: NotResultsPageProps) {
  return (
    <div className="flex flex-col items-center mt-8 gap-4 px-4">
      <img
        className="w-3xs sm:w-xs rounded-full"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6rRDm-8G25ObrfQpjTKcM0LGwJynBShE5lADmnDdmhE7Jkjaai0lBWoYmREKcMxEKczAaT3QgwGGo3gfRGLiXEDq7oC4NDXjudBTlfkuEDiYr-18EJLcB9lLXFeMmL3RoQrc8aoEGsyjuaKuTYexOanK-7c5aklTPoqBlIa5xzUHyAF649glqrNEhB-zuaRywSHu08yXgpgm44Yz3bALJkAQJV8UHAcwJWfKwqfUlpjsgxLYZh-fupqlghPUQMdj1Ypt-ooR0sG4"
        alt="A vintage black game controller with colorful buttons, disconnected and lying on a dark surface."
      />
      <h1 className="text-4xl sm:text-6xl font-orbitron font-bold text-center">
        Not results for <span className="text-blue-500">{gameTitle}</span>
      </h1>
      <p className="text-sm sm:text-base text-center text-primary-muted w-xs sm:w-sm md:w-lg">
        There are no games that match what you searched for
      </p>
      <Button variant="glitch-brightness">
        <Link to="/">Return to home</Link>
      </Button>
    </div>
  );
}

export default NotResultsPage;
