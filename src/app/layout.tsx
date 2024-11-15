import { Providers } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { aeonik, cn, generateMetadata, inter } from "@/utils";
import ErrorBoundary from '@/components/ErrorBoundary';
import AnimatedBackground from "@/components/ui/animated-background";
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = generateMetadata({
    title: "Simplify.AI⚡️",
    description: "Simplify.AI: AI data to JSON converter and #1 most advanced AI content generator."
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
   
            <html lang="en" className="scrollbar" suppressHydrationWarning>
                <head>
                    <link rel="icon" href="/icons/logo.png" />
                </head>
                <body
                    className={cn(
                        "min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden relative",
                        aeonik.variable,
                        inter.variable,
                    )}
                >
                    <Providers>
                        <Toaster richColors theme="dark" position="top-right" />
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </Providers>
                    
                    {/* Logo icon positioned at the top right */}
                    <div className="absolute top-4 right-4">
                        <img src="/icons/logo.png" alt="Logo" className="h-8 w-8" />
                    </div>
                </body>
            </html>
  
    );
} 