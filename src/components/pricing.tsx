"use client";

import { plans } from './constants';
import { cn } from '@/lib/utils';
import { CircleArrowUp, CreditCard, Gem, Headset, Zap, Sparkles, Infinity, Star, Rocket } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimationContainer from '@/components/global/animation-container';
import Link from 'next/link'; // Import Link from next/link

interface Props {
    plan: {
        id: number;
        title: string;
        priceMonthly: string;
        priceYearly: string;
        buttonText: string;
        features: string[];
    };
    billPlan: "monthly" | "annually";
}

type Plan = "monthly" | "annually";

const PlanCard = ({ plan, billPlan }: Props) => {
    return (
        <div className="group relative flex flex-col p-8 bg-black/60 backdrop-blur-3xl border-0 rounded-3xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500 via-blue-600 to-pink-600 rounded-3xl z-[-1]" />
            <div className="absolute inset-[1px] bg-black/90 rounded-[calc(1.5rem-1px)] z-[-1]" />
            
            <h3 className="text-3xl font-bold text-white">{plan.title}</h3>
            
            <div className="mt-6">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                    {billPlan === "monthly" ? plan.priceMonthly : plan.priceYearly}
                </span>
                <span className="ml-2 text-lg text-white/60">/month</span>
            </div>
            
            <ul className="mt-8 space-y-5">
                {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80 hover:text-white transition-colors duration-300">
                        <div className="relative w-5 h-5 mr-3">
                            <Sparkles className="absolute inset-0 text-cyan-500 animate-pulse" />
                            <Sparkles className="absolute inset-0 text-blue-600 animate-pulse delay-75" />
                        </div>
                        <span className="text-base backdrop-blur-sm">{feature}</span>
                    </li>
                ))}
            </ul>
            
            <Link href="/pricing">
                <Button className="relative mt-10 w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <span className="relative z-10 flex items-center justify-center">
                        <Sparkles className="mr-2 w-5 h-5 animate-pulse text-white" />
                        {plan.buttonText}
                    </span>
                </Button>
            </Link>
        </div>
    );
};

const Pricing = () => {
    const [billPlan, setBillPlan] = useState<Plan>("monthly");

    const handleSwitch = () => {
        setBillPlan((prev) => (prev === "monthly" ? "annually" : "monthly"));
    };

    return (
        <div className="relative flex flex-col items-center justify-center max-w-7xl py-32 mx-auto overflow-hidden">
            
            <div className="relative flex flex-col items-center justify-center max-w-3xl mx-auto z-10">
                <div className="w-full rounded-[2rem] backdrop-blur-3xl">
                    <AnimationContainer className="flex flex-col items-center justify-center p-12">
                        <Badge className="backdrop-blur-3xl bg-gradient-to-r from-cyan-500/50 via-blue-600/60 to-pink-600/50 border-0 px-8 py-3 rounded-2xl">
                            <div className="relative w-5 h-5">
                                <Star className="absolute inset-0 text-cyan-600 animate-pulse" />
                                <Star className="absolute inset-0 text-blue-600 animate-pulse delay-75" />
                            </div>
                            <span className="ml-2 text-base font-medium tracking-wider text-white/90">CHOOSE YOUR PLAN</span>
                        </Badge>
                        
                        <h2 className="mt-10 text-6xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 leading-tight">
                        Marketing Hub✨
                        </h2>
                        
                        <p className="max-w-2xl mt-8 text-center text-white/90 text-3xl font-bold leading-tight backdrop-blur-sm">
                        Generate any data to JSON and convert any video to blog with our advanced AI model!
                        </p>
                    </AnimationContainer>

                    <AnimationContainer delay={0.2}>
                        <div className="flex items-center justify-center space-x-8 mt-12 mb-8">
                            <span className="text-lg font-medium text-white/90">Monthly</span>
                            <button onClick={handleSwitch} className="relative rounded-full focus:outline-none group">
                                <div className="w-20 h-10 transition-all duration-500 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-pink-500"></div>
                                <div
                                    className={cn(
                                        "absolute inline-flex items-center justify-center w-8 h-8 transition-all duration-500 ease-spring top-1 left-1 rounded-full bg-white shadow-xl",
                                        billPlan === "annually" ? "translate-x-10" : "translate-x-0"
                                    )}
                                >
                                    <Infinity className="w-4 h-4 text-cyan-500 animate-pulse" />
                                </div>
                            </button>
                            <span className="text-lg font-medium text-white/90">Annually</span>
                        </div>
                    </AnimationContainer>
                </div>
            </div>

            <div className="relative grid w-full grid-cols-1 gap-8 pt-20 lg:grid-cols-3 md:pt-24 lg:pt-28 px-6">
                {plans.map((plan, idx) => (
                    <AnimationContainer key={idx} delay={0.1 * idx + 0.2}>
                        <PlanCard key={plan.id} plan={plan} billPlan={billPlan} />
                    </AnimationContainer>
                ))}
            </div>

            <div className="relative flex items-center w-full mt-20 lg:justify-evenly flex-wrap justify-center gap-8 lg:mt-24">
                <AnimationContainer delay={0.4} className="group flex items-center gap-x-4 backdrop-blur-3xl bg-gradient-to-r from-cyan-500/5 via-blue-600/5 to-pink-600/5 px-8 py-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105">
                    <CreditCard className="w-6 h-6 text-cyan-500 animate-pulse" />
                    <span className="text-lg text-white/80 group-hover:text-white/90">Enterprise Security</span>
                </AnimationContainer>
                <AnimationContainer delay={0.5} className="group flex items-center gap-x-4 backdrop-blur-3xl bg-gradient-to-r from-cyan-500/5 via-blue-600/5 to-pink-600/5 px-8 py-4 rounded-2xl border border-blue-600/20 hover:border-blue-600/40 transition-all duration-500 hover:scale-105">
                    <Headset className="w-6 h-6 text-blue-600 animate-pulse" />
                    <span className="text-lg text-white/80 group-hover:text-white/90">24/7 Support</span>
                </AnimationContainer>
                <AnimationContainer delay={0.6} className="group flex items-center gap-x-4 backdrop-blur-3xl bg-gradient-to-r from-cyan-500/5 via-blue-600/5 to-pink-600/5 px-8 py-4 rounded-2xl border border-pink-600/20 hover:border-pink-600/40 transition-all duration-500 hover:scale-105">
                    <Rocket className="w-6 h-6 text-pink-600 animate-pulse" />
                    <span className="text-lg text-white/80 group-hover:text-white/90">Rapid Innovation</span>
                </AnimationContainer>
            </div>
        </div>
    );
};

export default Pricing;
