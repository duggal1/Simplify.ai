

import { AnimationContainer, MaxWidthWrapper, PricingCards } from "@/components";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import Meteors from "@/components/ui/meteors";
import SparklesText from "@/components/ui/sparkles-text";
import { COMPANIES, PROCESS } from "@/utils";
import { REVIEWS } from "@/utils/constants/misc";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRightIcon, ArrowRight, CreditCardIcon, StarIcon, BarChart3, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AiTabs } from "@/components/tabs";
import { SignupFormDemo } from "@/components/ui-form";
import Pricing from "@/components/pricing";
import Offerings from "@/components/offerings";
import Particles from "@/components/ui/particles";
import { HeroVideoDialog } from "@/components/video-ai";
import { VideoDialog } from "@/components/video-dialog";


const HomePage = async () => {
    const user = await currentUser();

    return (
        <div className="overflow-x-hidden scrollbar-hide size-full">
            {/* Hero Section */}
            <MaxWidthWrapper>
                <Meteors number={30} />
                <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-black relative">
                    <SparklesText className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent" text="Magic UI" />
                    <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                        <button className="group relative grid overflow-hidden rounded-full px-8 py-3 shadow-[0_0_25px_rgba(139,92,246,0.3)] bg-gradient-to-r from-violet-600/30 to-indigo-600/30 backdrop-blur-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-500 border border-violet-500/20">
                            <span className="z-10 py-0.5 text-sm text-neutral-50 flex items-center justify-center gap-2 font-medium tracking-wider">
                                🚀 The Future of AI Data Processing is Here
                                <ArrowRightIcon className="ml-1 size-4 transition-transform duration-500 ease-out group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 animate-pulse"></div>
                        </button>
                        <h1 className="text-center py-10 text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl !leading-[0.9] w-full font-heading bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 animate-gradient-x [text-shadow:0_0_80px_rgba(139,92,246,0.5)]">
                            Transform Data <br/>
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient-y [text-shadow:0_0_80px_rgba(59,130,246,0.5)]">
                                With AI Magic
                            </span>
                        </h1>
                        
                        <p className="mb-14 text-xl tracking-tight text-neutral-100 md:text-2xl max-w-3xl mx-auto font-light">
                            #1 AI-Powered JSON Converter & Content Generator
                            <br className="hidden md:block" />
                            <span className="hidden md:block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-medium">Transform Any Data Format. Generate Elite Content. Scale Effortlessly.</span>
                        </p>
                        
                        <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
                            <Link href="/dashboard" className="group relative flex items-center justify-center w-max rounded-full border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 backdrop-blur-2xl px-4 py-3 gap-4 shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-500 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 animate-pulse rounded-full"></div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <p className="relative z-10 text-base font-medium bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text text-transparent">
                                    ✨ Transform Your Data Instantly
                                </p>
                                <Button size="sm" className="relative z-10 rounded-full bg-white text-slate-800 border-none shadow-lg hover:shadow-xl hover:shadow-violet-500/30 hover:bg-gradient-to-r hover:from-violet-600 hover:via-fuchsia-600 hover:to-indigo-600 hover:text-white transition-all duration-500">
                                    <span className="font-medium">Get Started</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                            </Link>
                        </div>
                    </AnimationContainer>
                    <AnimationContainer delay={0.2} className="relative pt-28 pb-24 md:py-40 px-2 bg-transparent w-full">
                        <div className="absolute top-1/4 left-1/2 w-full -translate-x-1/2 h-1/2 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-indigo-500/50 blur-[10rem] animate-pulse"></div>
                        <div className="-m-2 rounded-[2.5rem] p-6 ring-2 ring-inset ring-white/30 lg:-m-4 lg:rounded-[3rem] bg-black/60 backdrop-blur-3xl hover:ring-violet-500/50 transition-all duration-700 group hover:scale-[1.05] hover:shadow-2xl hover:shadow-violet-500/50">
                            <BorderBeam
                                size={500}
                                duration={5} 
                                delay={3}
                            />
                            <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-black/90 via-black/80 to-black/90">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-700/30 via-fuchsia-700/30 to-indigo-700/30 animate-gradient-xy"></div>
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255,255,255,0.2)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black,transparent)]"></div>
                                <Image
                                    src="/assets/dashboard-ai.png"
                                    alt="Simplify.AI Dashboard"
                                    width={1400}
                                    height={1400}
                                    quality={100}
                                    className="relative z-10 transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-1 group-hover:brightness-125 shadow-lg shadow-violet-500/50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                            <div className="absolute -bottom-6 inset-x-0 w-full h-1/2 bg-gradient-to-t from-black via-black/90 to-transparent z-40"></div>
                            <div className="absolute bottom-0 md:-bottom-10 inset-x-0 w-full h-1/3 bg-gradient-to-t from-black via-black/95 to-transparent z-50"></div>
                        </div>
                        <div className="flex items-center justify-center whitespace-nowrap gap-8 z-50">
                            <Button asChild className="px-10 py-7 text-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-indigo-500 border-none shadow-xl hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 rounded-2xl backdrop-blur-xl hover:backdrop-blur-2xl group relative overflow-hidden">
                                <Link href={user ? "/dashboard" : "/auth/sign-in"} className="flex items-center gap-3">
                                    <span className="relative z-10 font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text">🚀Convert your first data to json</span>
                                    <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 animate-pulse"></div>
                                    <div className="absolute -inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
                                </Link>
                            </Button>
                            </div>
                    </AnimationContainer>
                    </div>
            </MaxWidthWrapper>
       
            <MaxWidthWrapper>
                <AnimationContainer delay={0.4}>
                    <div className="py-14 relative">
                        <div className="absolute inset-0 "></div>
                        <div className="mx-auto px-4 md:px-8 relative">
                            <h2 className="text-center text-6xl font-bold font-heading bg-gradient-to-r from-purple-600 via-blue-600 to-black bg-clip-text text-transparent animate-gradient-x uppercase tracking-wider">
                                Trusted by the best in the industry
                            </h2>
                            <div className="mt-8">
                                <ul className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-16 justify-center [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                                    {COMPANIES.map((company) => (
                                        <li key={company.name} className="transform transition-all duration-500 hover:scale-110 hover:brightness-125">
                                            <Image
                                                src={company.logo}
                                                alt={company.name}
                                                width={80}
                                                height={80}
                                                quality={100}
                                                className="w-28 h-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                
                   
                </AnimationContainer>
       
            </MaxWidthWrapper>
           
            <VideoDialog/>
            {/* Features Section */}
            <MaxWidthWrapper className="pt-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col w-full items-center lg:items-center justify-center py-12 relative overflow-hidden">
                        {/* Multi-layered animated gradients for ultra-modern effect */}
                     
                        <div
                          className="relative z-10"
                        >
                          <MagicBadge title="Features" />
                        </div>

                        <div 
                          className="text-center lg:text-center text-8xl md:text-8xl !leading-[1.1] font-bold font-heading bg-gradient-to-b from-white/80 via-neutral-200 to-gray-200/20 bg-clip-text text-transparent animate-gradient-x mt-6 hover:scale-105 transition-transform duration-500 relative z-10"
                        >
                            Manage Links <br/>Like a Pro
                        </div>

                        <div 
                          className="mt-6 text-center font-bold lg:text-center text-2xl bg-gradient-to-br from-white/60 to-neutral-500 bg-clip-text text-transparent max-w-lg backdrop-blur-3xl relative z-10 hover:scale-105 transition-transform duration-500"
                        >
                            Simplify.AI The #1 most advanced AI content generator and data converter to JSON in seconds!
                        </div>

                        </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <BentoGrid className="py-8 relative">
                        {/* Multi-layered ultra-modern gradient borders and effects */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-900/30 via-fuchsia-800/30 to-cyan-900/30 blur-3xl animate-pulse"></div>
                        <div className="absolute -inset-2 bg-gradient-conic from-indigo-900/40 via-purple-800/40 to-blue-900/40 animate-spin-slow blur-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 animate-pulse"></div>
                        <div className="absolute -inset-1 bg-gradient-radial from-violet-500/30 via-transparent to-transparent animate-pulse"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_100%)] animate-pulse"></div>
                        
                        {/* Animated border glow */}
                        <div className="absolute inset-0 border border-violet-900/50 rounded-xl shadow-[0_0_50px_rgba(139,92,246,0.5)] animate-border-glow"></div>
                        
                        {CARDS.map((feature, idx) => (
                            <BentoCard 
                                key={idx} 
                                {...feature} 
                                className="backdrop-blur-xl hover:shadow-[0_0_70px_rgba(139,92,246,0.7)] hover:scale-[1.02] transition-all duration-500 border border-violet-500/20 relative overflow-hidden group"
                            />
                        ))}
                    </BentoGrid>
                </AnimationContainer>
            </MaxWidthWrapper>
            <Offerings/>
            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="The Process" />
                        <h2 className="text-center lg:text-center text-6xl font-extrabold text-transparent mt-6 bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text animate-gradient-x">
                            Simplify.AI<br/>
                            The Ultimate AI Data Converter
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg font-medium text-white/60 max-w-lg">
                            Experience the power of simplify.ai, the ultra-advanced AI content generator and data to JSON converter, transforming your workflow in seconds!
                        </p>
                        </div>
                        </AnimationContainer>
                       
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
                    {[
                        {
                            icon: <CreditCardIcon className="w-10 h-10 text-foreground" />,
                            title: "Advanced AI Email Campaigns",
                            description: "Supercharge your outreach with our cutting-edge AI that crafts personalized emails in seconds!"
                        },
                        {
                            icon: <BarChart3 className="w-10 h-10 text-foreground" />,
                            title: "Convert Any Excel File to Get Predictive Analytics",
                            description: "Transform your spreadsheets into powerful insights and forecasts effortlessly!"
                        },
                        {
                            icon: <VideoIcon className="w-10 h-10 text-foreground" />,
                            title: "Our Most Advanced AI Model",
                            description: "Convert your favorite videos into engaging blogs in seconds—effortless content creation at its best!"
                        }
                    ].map((item, id) => (
                        <AnimationContainer delay={0.2 * id} key={id}>
                            <a href="/dashboard">
                                <MagicCard className="group md:py-8 backdrop-blur-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500">
                                    <div className="flex flex-col items-start justify-center w-full">
                                        {item.icon}
                                        <div className="flex flex-col relative items-start">
                                            <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                                                {id + 1}
                                            </span>
                                            <h3 className="text-base mt-6 font-medium text-foreground">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </MagicCard>
                            </a>
                        </AnimationContainer>
                    ))}

                   
                </div>
                </MaxWidthWrapper>
            {/* Pricing Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Simple Pricing" />
                        <h2 className="text-center lg:text-center text-5xl md:text-7xl !leading-[1.1] font-extrabold font-heading  mt-6 bg-gradient-to-r from-black via-purple-700 to-blue-700 bg-clip-text  text-transparent animate-gradient-x">
                            Choose a plan that works for you
                        </h2>
                        <p className="mt-4 text-center lg:text-center  text-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300/30 max-w-lg">
                            Get started with simplify.AI today and enjoy more features with our pro plans.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.4}>
                    <Pricing/>
                </AnimationContainer>
                <AnimationContainer delay={0.3}>
                    <div className="flex flex-wrap items-start md:items-center justify-center lg:justify-evenly gap-6 mt-12 max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-2">
                            <CreditCardIcon className="w-10 h-10 text-green-600" />
                            <span className="text-muted-foreground text-white text-5xl font-bold">
                                No credit card required
                            </span>
                        </div>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>
            {/* Reviews Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Our Customers" />
                        <h2 className="text-center lg:text-center text-5xl md:text-7xl !leading-[1.1] font-medium font-heading mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            What our users are saying
                        </h2>
                        <h3 className="text-6xl">
                        🤔
                        </h3>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Here&apos;s what some of our users have to say about simplify.AI.
                        </p>
                    </div>
                </AnimationContainer>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 md:gap-8 py-10">
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(0, 3).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                    <Card className="flex flex-col w-full border-none h-min bg-gradient-to-r from-gray-300 to-white shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(3, 6).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                <Card className="flex flex-col w-full border-none h-min bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium  text-white ">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground text-white ">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                    <div className="flex flex-col items-start h-min gap-6">
                        {REVIEWS.slice(6, 9).map((review, index) => (
                            <AnimationContainer delay={0.2 * index} key={index}>
                                <MagicCard key={index} className="md:p-0">
                                <Card className="flex flex-col w-full border-none h-min bg-gradient-to-r from-gray-300 to-white shadow-lg rounded-lg">
                                        <CardHeader className="space-y-0">
                                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.username}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <p className="text-muted-foreground">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="w-full space-x-1 mt-auto">
                                            {Array.from({ length: review.rating }, (_, i) => (
                                                <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                </div>
            </MaxWidthWrapper>
            <div >                       
                <SignupFormDemo/>
            </div>
            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                    <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="text-4xl flex justify-center text-center relative md:text-4xl lg:text-7xl font-bold  w-max bg-clip-text text-transparent bg-gradient-to-br from-purple-600 via-blue-600 to-black py-4 mt-8 ">
                                Simplify your data  <br/>
                             with the most advanced AI
                            </h2>
                            <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-white  via-slate-300 to-gray-600/30">
                                Discover the leading solution for converting <br/>data to JSON and generating top-notch content effortlessly.
                            </p>
                            <div className="mt-6">
                            <SparklesText  text=" Exciting times ahead!" />
                                <Button className="bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 text-white  text-xl font-semibold py-3 px-3 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                                    Get started for free
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>
            </div>
        )
    };
    
    export default HomePage
