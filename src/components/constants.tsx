import { Activity, BarChart2, BarChart3, BarChartBig, CalendarClock, Captions, Fullscreen, HandHeart, HeartHandshake, Languages, LineChart, NotebookPen, Recycle, Smile, TrendingUp, Users, Zap } from "lucide-react";
import { Icons } from "./Icons";

export const plans = [
    {
        id: 1,
        title: "Free",
        priceMonthly: "$0",
        priceYearly: "$0",
        buttonText: "Get Started for Free",
        features: [
            "Data to JSON converters (3 conversions/month)",
            "Basic AI YouTube video to blogs (5 videos/month)", 
            "Basic web scraper (3 scrapes/month)",
            "Limited blogs (5 blogs/month)",
            "Basic AI email marketing (3 emails/month)",
            "Excel to analytics and JSON (3 files/month)",
            "Website URL to Next.js conversion (1 site/month)"
        ]
    },
    {
        id: 2,
        title: "Standard", 
        priceMonthly: "$6.99",
        priceYearly: "$41.99",
        buttonText: "Upgrade to Standard",
        features: [
            "Data to JSON converters (100 conversions/month)",
            "Advanced AI YouTube video to blogs (50 videos/month)",
            "Advanced web scraper (50 scrapes/month)", 
            "Extended blogs (100 blogs/month)",
            "Advanced AI email marketing (50 emails/month)",
            "Excel to analytics and JSON (50 files/month)",
            "Website URL to Next.js conversion (5 sites/month)"
        ]
    },
    {
        id: 3,
        title: "Premium",
        priceMonthly: "$12.99",
        priceYearly: "$99.99",
        buttonText: "Upgrade to Premium",
        features: [
            "Unlimited data to JSON conversions",
            "Enterprise AI YouTube video to blogs",
            "Unlimited web scraping with advanced features",
            "Unlimited blogs with priority processing",
            "Advanced AI email marketing with no limits",
            "Unlimited Excel to analytics and JSON",
            "Unlimited website to Next.js conversions"
        ]
    }
];

export const badges = [
    {
        id: 1,
        title: "Analytics Insights",
        icon: LineChart,
    },
    {
        id: 2,
        title: "Content Creation",
        icon: NotebookPen,
    },
    {
        id: 3,
        title: "Audience Engagement",
        icon: Users,
    },
    {
        id: 4,
        title: "Community Management",
        icon: HeartHandshake,
    },
    {
        id: 5,
        title: "Brand Monitoring",
        icon: Activity,
    },
    {
        id: 6,
        title: "Performance Reports",
        icon: BarChart3,
    },
    {
        id: 7,
        title: "Content Scheduling",
        icon: CalendarClock,
    },
    {
        id: 8,
        title: "User Feedback",
        icon: HandHeart,
    },
    {
        id: 9,
        title: "Custom Integrations",
        icon: Zap,
    },
    {
        id: 10,
        title: "Content Optimization",
        icon: TrendingUp,
    }
];


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