import Image from "next/image";
import { orbitron } from "@/fonts/fonts";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-8 gap-4 px-4">
      <Image
        className="rounded-full"
        width={300}
        height={300}
        src="/not-found.png"
        alt="A vintage black game controller with colorful buttons, disconnected and lying on a dark surface."
      />
      <h1
        className={`text-4xl sm:text-6x font-bold text-center ${orbitron.className}`}
      >
        <span className="text-blue-500">404</span> - Page Lost
      </h1>
      <p className="text-sm sm:text-base text-center text-primary-muted w-xs sm:w-sm md:w-lg">
        This page must be in another castle. Looks like you took a wrong turn,
        but don't worry, we'll get you back on track.
      </p>
      <Link href="/feed" className="bg-blue-500 py-2 px-4 rounded-2xl">
        Return to feed
      </Link>
    </div>
  );
}
