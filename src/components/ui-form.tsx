"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";

const formSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"), 
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters")
});

interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer = React.forwardRef<HTMLDivElement, LabelInputContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {children}
      </div>
    );
  }
);
LabelInputContainer.displayName = "LabelInputContainer";

const BottomGradient = () => {
  return (
    <div
      className="absolute inset-x-0 -bottom-px h-px w-full
      bg-gradient-to-r from-transparent via-blue-500 to-transparent
      opacity-0 transition duration-500 group-hover/btn:opacity-100"
    />
  );
};

export function SignupFormDemo() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    company: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      formSchema.parse(formData);
      // If validation passes
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Success! 🎉
                </p>
                <p className="mt-1 text-sm text-gray-200">
                  Thank you for joining our waitlist! Well be in touch soon.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-gray-200 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ));
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight">
              SimplifyAI Early Access
            </h2>
            <p className="text-neutral-100 text-sm max-w-sm mt-2 mx-auto dark:text-neutral-400 font-light">
              Join the waitlist for our most advanced AI content generation model yet. Experience the future of content creation.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">First Name</Label>
                <Input 
                  id="firstname" 
                  placeholder="John" 
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={errors.firstname ? "border-red-500" : ""}
                />
                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last Name</Label>
                <Input 
                  id="lastname" 
                  placeholder="Smith" 
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={errors.lastname ? "border-red-500" : ""}
                />
                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
              </LabelInputContainer>
            </div>
            
            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="you@example.com" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </LabelInputContainer>
            
            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </LabelInputContainer>
            
            <LabelInputContainer>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Your Company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </LabelInputContainer>

            <button
              className="relative group/btn w-full h-12 font-medium rounded-xl transition-all duration-300
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
              hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
              text-white shadow-[0_0_20px_rgba(60,60,255,0.5)]
              hover:shadow-[0_0_25px_rgba(60,60,255,0.7)]"
              type="submit"
            >
              Get Early Access ⚡️
              <BottomGradient />
            </button>
          </form>
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="text-center md:text-left space-y-4">
            <h1 className="font-bold text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight">
              Over 10,000 Potential Clients<br/> Have Already
              <br/> Joined Us!
            </h1>

            <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-gray-300/20 tracking-tight">
              Join us now for advanced AI-powered solutions:
              <div className="flex flex-col space-y-2 mt-4 text-xl">
                <span>• JSON data conversion</span>
                <span>• #1 rated YouTube to blog transformation</span>
                <span>• And much more!</span>
              </div>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}       
