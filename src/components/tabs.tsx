"use client";

import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";

export function AiTabs() {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-3xl p-12 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-600 tracking-tight leading-none">
              Dashboard
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
              Experience the future of analytics with our ultra-modern dashboard solution. Powered by cutting-edge AI to transform your data into actionable insights.
            </p>
            <a href="/dashboard" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/25">
              Learn More
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services", 
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-3xl p-12 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-600 tracking-tight leading-none">
              Convert URL to Blogs ✨
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
              Transform any URL into engaging blog content instantly with our AI-powered content generation service. Smart, efficient, and perfectly optimized.
            </p>
            <a href="/services" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-emerald-500/25">
              Explore Services
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-3xl p-12 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-600 tracking-tight leading-none">
              Playground
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
              Experiment with our cutting-edge tools in an interactive environment. Turn your data into meaningful insights with Excel to Analytics conversion.
            </p>
            <a href="/playground" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-fuchsia-500/25">
              Start Playing
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-3xl p-12 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600 tracking-tight leading-none">
              AI Web Scraping
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
              Our most advanced AI-powered web scraping solution. Extract, analyze, and transform web data with unprecedented accuracy and speed.
            </p>
            <a href="/content" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-orange-500/25">
              Discover More
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-3xl p-12 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600 tracking-tight leading-none">
              ⚡️Email Marketing
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
              Supercharge your email campaigns with AI-driven insights and automation. Reach the right audience at the perfect moment.
            </p>
            <a href="/marketing" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-yellow-500/25">
              Get Started
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-7xl mx-auto w-full items-start justify-start my-40">
      
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className="relative mt-8">
      <Image
        src="/assets/dashboard-ai.png"
        alt="Product visualization"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    </div>
  );
};

export default AiTabs;