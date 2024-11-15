"use client";

import { getAuthStatus } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { Suspense } from 'react';

// Create a client-side only component
const AuthCallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => {
            const response = await getAuthStatus();
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        },
        retry: 1,
        retryDelay: 1000,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchInterval: false,
    });

    useEffect(() => {
        if (data?.success) {
            router.replace(redirectTo);
        }
        
        if (isError) {
            router.replace("/auth/error");
        }
    }, [data, isError, router, redirectTo]);

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-red-500 text-xl font-semibold">
                        Authentication Error
                    </h2>
                    <p className="text-gray-600">
                        {error instanceof Error ? error.message : "Authentication failed"}
                    </p>
                    <button 
                        onClick={() => router.replace('/auth/sign-in')}
                        className="text-blue-500 hover:text-blue-600 underline"
                    >
                        Return to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 font-medium">
                    {isLoading ? "Verifying your account..." : "Setting up your dashboard..."}
                </p>
            </div>
        </div>
    );
};

// Create a wrapper component that handles the loading state
const AuthCallbackPage = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                        <p className="text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
};

export default AuthCallbackPage;

// Add this to prevent static optimization
export const dynamic = 'force-dynamic';