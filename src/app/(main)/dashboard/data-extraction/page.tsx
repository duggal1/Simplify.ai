import { CodeConverter } from '@/components/CodeConverter';
import { Metadata } from 'next';
import Navbar from '@/components/navigation/navbar';
import ModernSidebar from "@/components/SideBar/page";
import Footer from '@/components/navigation/footer';
export const metadata: Metadata = {
  title: 'Code Extraction & Conversion | Dashboard',
  description: 'Extract and convert code between different programming languages using AI',
};

export default function DataExtractionPage() {
  return (
    <div className="sticky top-0 z-50 bg-black ">
        <Navbar/>
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <ModernSidebar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="relative overflow-hidden pb-32 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 dark:from-purple-900/30 dark:to-blue-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Code Extraction & Conversion
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Extract code from any URL or paste directly. Convert between languages using advanced AI.
            </p>
          </div>
        </div>
        
        {/* Decorative blob shapes */}
        <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
          <div
            className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-purple-500/40 to-blue-500/40 opacity-25"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="absolute -bottom-24 left-0 -z-10 transform-gpu blur-3xl">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-r from-blue-500/40 to-purple-500/40 opacity-25"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl ring-1 ring-black/5 dark:ring-white/5">
            <div className="p-2 sm:p-6 lg:p-8">
              <CodeConverter />
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-900/10">
                  <svg
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  Multiple Languages
                </h3>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Convert between TypeScript, React, Next.js, JavaScript, Python, and Java.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-900/10">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  AI-Powered
                </h3>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Advanced AI ensures high-quality code conversion with proper types and best practices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-900/10">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  URL Extraction
                </h3>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Extract code directly from any URL or paste your code manually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    </div>

  );
}
