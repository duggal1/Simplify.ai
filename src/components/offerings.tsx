"use client"

import { Activity,LifeBuoy, BarChart2, BarChart3, BarChartBig, CalendarClock, Captions, Fullscreen, HandHeart, HeartHandshake, Languages, LineChart, NotebookPen, Recycle, Smile, TrendingUp, Users, Zap, LucideIcon } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import AnimationContainer from "@/components/global/animation-container";

export const offerings = [
    {
        id: 1,
        title: "Data to JSON Conversion",
        description: "Convert any data into JSON format using advanced AI technology.",
        icon: BarChart3 // Changed to a more powerful icon
    },
    {
        id: 2,
        title: "AI Email Marketing",
        description: "Leverage AI to enhance your email marketing campaigns for better engagement.",
        icon: Zap // Changed to a more powerful icon
    },
    {
        id: 3,
        title: "Excel to Analytics & JSON",
        description: "Transform Excel spreadsheets into actionable analytics and JSON data.",
        icon: BarChartBig // Changed to a more powerful icon
    },
    {
        id: 4,
        title: "Video to Blog Post",
        description: "Convert any video content into engaging blog posts effortlessly.",
        icon: TrendingUp // Changed to a more powerful icon
    },
    {
        id: 5,
        title: "Insightly Blogs",
        description: "Access insightful blogs that provide valuable information and tips.",
        icon: Fullscreen // Changed to a more powerful icon
    },
    {
        id: 6,
        title: "AI Web Scraping",
        description: "Utilize AI for efficient web scraping to gather data from various sources.",
        icon: Languages // Changed to a more powerful icon
    },
    {
        id: 7,
        title: "Website to Next.js Software",
        description: "Convert any website URL into a Next.js application seamlessly.",
        icon: Activity // Changed to a more powerful icon
    },
];
interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
}

const Offerings = () => {
    return (
        <div className="flex flex-col relative items-center justify-center py-32">
            {/* Ultra modern gradient orbs */}
            <div className="hidden lg:block absolute top-0 -right-1/4 bg-gradient-to-r from-primary/30 to-purple-500/30 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] animate-pulse"></div>
            <div className="hidden lg:block absolute -bottom-1/4 -left-1/4 bg-gradient-to-r from-blue-500/30 to-primary/30 w-[500px] h-[500px] rounded-full -z-10 blur-[100px] animate-pulse delay-700"></div>

            <AnimationContainer>
                <div className="flex flex-col items-center justify-center mx-auto max-w-2xl">
                    <Badge className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2" variant="outline">
                        <LifeBuoy className="w-4 h-4 text-primary animate-pulse" />
                        <span className="ml-2 text-sm bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Everything on track⚡️
                        </span>
                    </Badge>
                    <h2 className="text-3xl mt-8 lg:text-5xl font-bold text-center xl:text-6xl bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                        Transform Any Data with AI Power 🚀
                    </h2>
                    <p className="mt-6 text-center text-gray-400 max-w-lg text-lg">
                        From JSON to blogs, emails to analytics - Simplify.AI handles it all with cutting-edge AI technology.
                    </p>
                </div>
            </AnimationContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-7xl gap-6 mt-16 lg:mt-24 px-4">
                {offerings.map((offering, index) => (
                    <AnimationContainer key={offering.id} delay={0.1 * index + 0.1}>
                        <Offering key={offering.id} {...offering} />
                    </AnimationContainer>
                ))}
            </div>
        </div>
    )
};

const Offering = ({ title, description, icon: Icon }: Props) => {
    return (
        <div className="group relative flex flex-col items-start p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-primary group-hover:animate-pulse" />
            </div>
            
            <h3 className="text-xl font-semibold mt-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
                {title}
            </h3>
            
            <p className="text-gray-400 mt-3 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {description}
            </p>
            
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>

            <a
                href="/dashboard"
                className="mt-6 px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
                Get Started
            </a>
        </div>
    )
};

export default Offerings;
