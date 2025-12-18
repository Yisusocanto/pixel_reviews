"use client";

import { Button, Card } from "@heroui/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { orbitron } from "@/fonts/fonts";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 flex flex-col items-center gap-6 bg-card border border-white/10">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1
          className={`${orbitron.className} text-2xl sm:text-3xl font-bold text-center`}
        >
          Something went wrong!
        </h1>

        {/* Description */}
        <p className="text-primary-muted text-center max-w-md">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="w-full p-4 rounded-lg bg-red-500/5 border border-red-500/10">
            <p className="text-sm text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400/60 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onPress={reset} className="flex items-center gap-2 px-6">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button className="flex items-center gap-2 px-6" asChild>
            <Link href="/feed">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
