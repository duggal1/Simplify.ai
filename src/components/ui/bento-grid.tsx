import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/utils";
import { ArrowRightIcon, CalendarIcon, Link2Icon, SearchIcon, WaypointsIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Integrations } from "./integrations";
import { Label } from "./label";

export const CARDS = [
    {
        Icon: Link2Icon,
        name: "Transform Content Instantly",
        description: "Harness AI to convert any data format into pristine JSON in seconds.",
        href: "#",
        cta: "Experience Magic",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Card className="absolute top-10 left-10 origin-top rounded-none rounded-tl-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-violet-500/20 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-blue-600 to-black/80 bg-clip-text text-transparent">
                        AI-Powered Conversion⚡️
                    </CardTitle>
                    <CardDescription>
                        Transform any content into structured JSON with cutting-edge AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="-mt-4">
                    <Label>
                        Paste your content
                    </Label>
                    <Input
                        type="text"
                        placeholder="Transform any format..."
                        className="w-full focus-visible:ring-0 focus-visible:ring-transparent bg-gradient-to-r from-violet-900/10 to-fuchsia-900/10"
                    />
                </CardContent>
            </Card>
        ),
    },
    {
        Icon: SearchIcon,
        name: "AI-Enhanced Search",
        description: "Ultra-fast content discovery powered by next-gen AI algorithms.",
        href: "#",
        cta: "Explore Power",
        className: "col-span-3 lg:col-span-2",
        background: (
            <Command className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-violet-500/20 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2 backdrop-blur-xl">
                <Input placeholder="Search with AI..." className="bg-gradient-to-r from-violet-900/10 to-fuchsia-900/10" />
                <div className="mt-1 cursor-pointer">
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/transform-01</div>
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/content-02</div>
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/json-03</div>
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/ai-04</div>
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/magic-05</div>
                    <div className="px-4 py-2 hover:bg-violet-500/10 rounded-md">simplify.ai/power-06</div>
                </div>
            </Command>
        ),
    },
    {
        Icon: WaypointsIcon,
        name: "Seamless Integration",
        description: "Connect with elite AI tools and supercharge your workflow.",
        href: "#",
        cta: "Unleash Power",
        className: "col-span-3 lg:col-span-2 max-w-full overflow-hidden",
        background: (
            <Integrations className="absolute right-2 pl-28 md:pl-0 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: CalendarIcon,
        name: "Smart Timeline",
        description: "Track your AI transformations with intelligent scheduling.",
        className: "col-span-3 lg:col-span-1",
        href: "#",
        cta: "View Magic",
        background: (
            <Calendar
                mode="single"
                selected={new Date(2022, 4, 11, 0, 0, 0)}
                className="absolute right-0 top-10 origin-top rounded-md border border-violet-500/20 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105 backdrop-blur-xl"
            />
        ),
    },
];

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
                className,
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href: string;
    cta: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between border border-violet-500/20 overflow-hidden rounded-xl",
            "bg-black/80 backdrop-blur-xl [box-shadow:0_-20px_80px_-20px_#8b5cf680_inset]",
            className,
        )}
    >
        <div>{background}</div>
        <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
            <Icon className="h-12 w-12 origin-left text-blue-400 transition-all duration-300 ease-in-out group-hover:scale-75" />
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-100">{description}</p>
        </div>

        <div
            className={cn(
                "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Link href={href} className={buttonVariants({ size: "sm", variant: "ghost", className: "cursor-pointer hover:bg-violet-500/20" })}>
                {cta}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" />
    </div>
);

export { BentoCard, BentoGrid };
