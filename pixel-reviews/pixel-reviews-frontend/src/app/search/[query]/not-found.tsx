import Link from "next/link";
import { Button } from "@heroui/react";
import Image from "next/image";

async function NotResultsPage() {
  return (
    <div className="flex flex-col items-center mt-8 gap-4 px-4">
      <Image
        className="w-3xs sm:w-xs rounded-full"
        width={350}
        height={350}
        loading="eager"
        src="/not-found.png"
        alt="A vintage black game controller with colorful buttons, disconnected and lying on a dark surface."
      />
      <h1 className="text-4xl sm:text-6xl font-orbitron font-bold text-center">
        Not results
      </h1>
      <p className="text-sm sm:text-base text-center text-primary-muted w-xs sm:w-sm md:w-lg">
        There are no games that match what you searched for
      </p>
      <Button>
        <Link href="/feed">Return to home</Link>
      </Button>
    </div>
  );
}

export default NotResultsPage;
