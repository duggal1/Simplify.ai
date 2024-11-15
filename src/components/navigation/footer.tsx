"use client"

import Image from 'next/image';
import { Heart, Twitter, Instagram, Youtube, Github } from 'lucide-react';
import Link from 'next/link';
import AnimationContainer from '../global/animation-container';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

const Footer = () => {
    const { toast } = useToast();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;

        toast({
            title: "🎉 Successfully subscribed!",
            description: "Welcome to our newsletter family! Stay tuned for amazing updates.",
            className: "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-md",
            duration: 5000,
        });

        setEmail('');
    };

    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-8 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32">

            <div className="hidden lg:block absolute -top-1/3 -right-1/4 bg-primary w-72 h-72 rounded-full -z-10 blur-[14rem]"></div>
            <div className="hidden lg:block absolute bottom-0 -left-1/4 bg-primary w-72 h-72 rounded-full -z-10 blur-[14rem]"></div>

            <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">
                <div className="flex flex-col items-start justify-start md:max-w-[300px] group relative">
                    <div className="flex flex-col items-start space-y-6 backdrop-blur-sm bg-black/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-primary/20">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                <Image 
                                    src="/icons/logo.png" 
                                    alt="Logo" 
                                    width={40} 
                                    height={40}
                                    className="relative rounded-lg p-1 bg-black/50 backdrop-blur-sm border border-white/10"
                                />
                            </div>
                            <p className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Simplify.ai
                            </p>
                        </div>
                        
                        <p className="text-sm font-medium leading-relaxed bg-gradient-to-br from-blue-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent animate-gradient-xy">
                            DATA TO JSON CONVERSIONS MADE SUPER EASY✨
                        </p>

                        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-xl backdrop-blur-md">
                            <span className="text-xs font-medium text-neutral-200 flex items-center">
                                TRY OUR MOST ADVANCED AI MODEL⚡️
                                <Heart className="w-3.5 h-3.5 ml-2 fill-pink-500 text-pink-500 animate-pulse" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div className="">
                            <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                                Product⚡️
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="mt-2">
                                    <Link href="/dashboard" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                     Json convertions
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/dashboard/youtube-blogs" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                  url to blogs
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/dashboard/ai-files" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                      exel to analytics 
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/dashboard/email-marketing" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                AI email marketing
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/dashboard/data-extraction" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                               Ai web scrapping
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-10 md:mt-0 flex flex-col">
                        <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                                Integrations
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Facebook
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href=""className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Instagram
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href=""className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        LinkedIn
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div className="">
                        <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                                Resources
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="mt-2">
                                    <Link href=""className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Blog
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Case Studies
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-10 md:mt-0 flex flex-col">
                        <h3 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                                Company
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        About Us
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href=""className="hover:text-blue-800 text-white/80 transition-all duration-300">
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

        
            </div>
            <AnimationContainer delay={0.5} className="w-full">
            <div className="border-t border-border/40 mt-16 md:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between w-full pt-8">
                <div className="flex flex-col items-start">
                    <h3 className="text-foreground font-medium">
                        Subscribe to our newsletter
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Get the latest news and updates about our product.
                    </p>
                </div>
                <div className="relative flex mt-4 lg:mt-0">
                    <form onSubmit={handleSubmit} className="flex items-center relative">
                        <Input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            spellCheck={false}
                            placeholder="Email address"
                            className="text-sm text-foreground focus:outline-none outline-none focus:border-primary bg-background/50 min-w-[300px] border border-white/10 backdrop-blur-md"
                        />
                        <Button 
                            type="submit" 
                            className="ml-2 px-6 bg-gradient-to-r from-blue-500 via-black to-blue-800 hover:from-blue-800 hover:to-pink-800 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                        >
                            Subscribe
                        </Button>
                    </form>
                </div>
            </div>
        </AnimationContainer>


            <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
            <p className="text-xl bg-gradient-to-b from-white via-neutral-100 to-slate-200/20 bg-clip-text text-transparent font-medium mt-8 md:mt-0">
            &copy; {new Date().getFullYear()} Simplify AI INC. All<br /> rights reserved.
        </p>
                <div className="flex gap-5 mt-4 md:mt-0">
                <Link href="https://github.com/harshitduggal1" className="smooth-transition">
                <Github className="w-8 h-8 text-gray-400 hover:text-blue-800 transition cursor-pointer" />
            </Link>
                    <Link href="https://twitter.com/harshitduggal5" className="smooth-transition">
                        <Twitter className="w-8 h-8 text-gray-400 hover:text-blue-800 transition cursor-pointer" />
                    </Link>
                    <Link href="https://instagram.com/harshitduggal5" className="smooth-transition">
                        <Instagram className="w-8 h-8 text-gray-400 hover:text-blue-800 transition cursor-pointer" />
                    </Link>
                    <Link href="https://youtube.com/harshitduggal5" className="smooth-transition">
                        <Youtube className="w-8 h-8 text-gray-400 hover:text-blue-800 transition cursor-pointer" />
                    </Link>
                   
                </div>
            </div>

        </footer>
    )
}

export default Footer
