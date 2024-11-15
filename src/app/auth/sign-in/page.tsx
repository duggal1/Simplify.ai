import { Icons, SignInForm } from "@/components";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image

const SignInPage = () => {
    return (
        <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20 backdrop-blur-lg">
            <div className="flex items-center w-full py-8 border-b border-border/80 backdrop-filter backdrop-blur-xl">
                <Link href="/#home" className="flex items-center gap-x-2 group hover:scale-105 transition-all duration-300 ease-in-out">
                    <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300/30">
                    Simplify.Ai
                    </h1>
                </Link>
            </div>

            <SignInForm />
            <div className="flex flex-col items-start w-full  p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-400">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="font-semibold text-blue-500 hover:text-blue-800 transition-all duration-300 hover:underline">
                        Terms of Service{" "}
                    </Link>
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-blue-500 hover:text-blue-800 transition-all duration-300 hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="flex items-start mt-auto border-t border-border/80 py-6 w-full backdrop-blur-md">
                <p className="text-xl font-bold text-gray-100">
                    Don&apos;t have an account?{" "}
                    <Link 
                        href="/auth/sign-up" 
                        className="font-semibold  text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 hover:text-blue-800 transition-all duration-300 hover:underline"
                    >
                        Sign up🚀
                    </Link>
                </p>
            </div>
        </div>
    )
};

export default SignInPage