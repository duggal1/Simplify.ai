"use client";

import { AnimationContainer, MaxWidthWrapper } from "@/components";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import MagicBadge from "@/components/ui/magic-badge";
import { FAQ } from "@/utils/constants/faq";
import Pricing from "@/components/pricing";
import Meteors from "@/components/ui/meteors";
import Particles from "@/components/ui/particles";

const PricingPage = () => {
    return (
        <MaxWidthWrapper className="mb-40 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full  pointer-events-none" />
            <Meteors number={20} />
            <Particles
                className="absolute inset-0"
                quantity={150}
                ease={100} 
                color="rgba(139,92,246,0.5)"

            />
            <AnimationContainer delay={0.1}>
                <div className="flex flex-col items-center justify-center py-10 max-w-lg mx-auto relative">
                 
                    <MagicBadge title="Pricing" />
                  
                    <h1 className="text-9xl md:text-8xl lg:text-8xl font-semibold font-heading text-center mt-6 !leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-neautral-200 to-gray-300/20 [text-shadow:0_0_120px_rgba(139,92,246,0.8)] animate-gradient-x">
                        Simple and transparent pricing⚡️
                    </h1>
                
                    <p className="text-base md:text-2xl mt-6 text-center text-neutral-200/80 backdrop-blur-xl relative ">
                        Choose a plan that works for you. No hidden fees. No surprises.
                    </p>
                </div>
            </AnimationContainer>

            <AnimationContainer delay={0.2}>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-indigo-600/20 blur-[120px] animate-pulse" />
                    <Pricing />
                </div>
            </AnimationContainer>

            <AnimationContainer delay={0.3}>
                <div className="mt-20 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/20 to-transparent blur-[150px] animate-pulse" />
                    <div className="flex flex-col items-center justify-center w-full pt-12">
                        <h2 className="mt-6 text-2xl font-semibold text-center lg:text-3xl xl:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 [text-shadow:0_0_100px_rgba(52,211,153,0.5)] animate-gradient-x">
                            Frequently Asked Questions
                        </h2>
                        <p className="max-w-lg mt-6 text-center text-neutral-300/90 backdrop-blur-xl [text-shadow:0_2px_10px_rgba(52,211,153,0.2)]">
                            Here are some of the most common questions we get asked. If you have a question that isn&apos;t answered here, feel free to reach out to us.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto w-full mt-20 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 rounded-xl blur-[100px] animate-pulse" />
                        <Accordion type="single" collapsible className="space-y-4">
                            {FAQ.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id} className="border border-violet-500/30 bg-black/50 backdrop-blur-2xl rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300">
                                    <AccordionTrigger className="px-6 hover:bg-violet-500/20 transition-all duration-300">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="px-6 text-neutral-300/90">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </AnimationContainer>
        </MaxWidthWrapper>
    );
};

export default PricingPage;
