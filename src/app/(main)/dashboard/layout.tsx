"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {  Navbar } from "@/components";
import { Footer } from "@/components";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/sign-in");
      } else {
        setIsInitialized(true);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin  text-4xl text-green-600 mx-auto" />
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-pink-600 to-purple-500 rounded-lg opacity-75 blur animate-pulse"></div>
            <p className="relative text-white text-7xl font-extrabold px-4 py-2">
              Loading your dashboard🚀...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary for database connection issues
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const handleError = (error: ErrorEvent) => {
        console.error("Error caught:", error);
        setHasError(true);
      };

      window.addEventListener("error", handleError);
      return () => window.removeEventListener("error", handleError);
    }, []);

    if (hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-300 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Connection Error
              </span>
            </h2>
            <p className="text-gray-600 mb-6">
              We&aposre having trouble connecting to our services. This might be due to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Database connection issues</li>
                <li>Network connectivity problems</li>
                <li>Server maintenance</li>
              </ul>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="relative group w-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <span className="relative block bg-white text-gray-800 px-6 py-3 rounded-xl text-center font-semibold group-hover:bg-gray-100 transition-all duration-200">
                Try Again
              </span>
            </button>
          </div>
          <Footer/>
        </div>
    
      );
    }

    return children;
  };

  // Render the dashboard with error boundary
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </ErrorBoundary>
  );
}