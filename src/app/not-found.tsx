import { Footer, Navbar } from '@/components';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const NotFound = () => {
    return (
        <main className="relative flex flex-col items-center justify-center px-4 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-30 blur-3xl animate-pulse" />

            <Navbar />

            <div className="flex flex-col items-center justify-center mx-auto h-screen relative z-10">
                <div className="flex items-center justify-center h-full flex-col backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50">
                    <span className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-700 text-white animate-shimmer">
                        404 Error
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-purple-300 to-gray-100 animate-text-shine text-center">
                        Page Not Found
                    </h1>

                    <p className="text-lg text-gray-400 font-medium mt-6 text-center mx-auto max-w-2xl leading-relaxed">
                        The page you are looking for does not exist. But don&apos;t worry, explore our{" "}
                        <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-500/30">
                            dashboard
                        </Link>
                        {" "}or try our{" "}
                        <Link href="/dashboard/email-marketing" className="text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-500/30">
                            email marketing
                        </Link>
                        {" "}tools.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link href="/dashboard">
                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl font-medium text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="border-gray-700 hover:bg-gray-800/50 text-gray-300 px-8 py-6 rounded-xl font-medium text-lg transition-all duration-300">
                                Back to Homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}

export default NotFound