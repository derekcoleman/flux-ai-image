"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, Sparkles, Star, Users, Zap } from "lucide-react";

import { GitHubBrandIcon, GoogleBrandIcon, MailIcon } from "@/assets";
import { url } from "@/lib";

import ShimmerButton from "../forms/shimmer-button";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";

const rotatingTexts = ["Brand Assets", "Product Photos", "Stunning Visuals"];

export default function HeroLanding() {
  const [textIndex, setTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy;
    if (!strategy) {
      return null;
    }

    switch (strategy) {
      case "from_oauth_github":
        return GitHubBrandIcon as (
          props: React.ComponentProps<"svg">,
        ) => JSX.Element;
      case "from_oauth_google":
        return GoogleBrandIcon;
      default:
        return MailIcon;
    }
  }, [user?.primaryEmailAddress?.verification.strategy]);

  const rotateText = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setTextIndex((current) => (current + 1) % rotatingTexts.length);
      setIsAnimating(true);
    }, 200);
  }, []);

  useEffect(() => {
    const interval = setInterval(rotateText, 3000);
    return () => clearInterval(interval);
  }, [rotateText]);

  return (
    <section
      className="relative min-h-screen animate-gradient bg-gradient-to-b from-gray-900 via-purple-900/40 to-black"
      id="home"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"
        aria-hidden="true"
      />

      {/* Navigation */}
      <nav className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div className="text-2xl font-bold text-white">
            Vizy<span className="text-purple-400">AI</span>
          </div>

          <AnimatePresence>
            <SignedIn key="user-info">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="pointer-events-auto relative flex h-10 items-center"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                >
                  <UserButton
                    afterSignOutUrl={url(pathname).href}
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 ring-2 ring-white/20",
                      },
                    }}
                  />
                  {StrategyIcon && (
                    <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                      <StrategyIcon className="h-3 w-3" />
                    </span>
                  )}
                </motion.div>
                {!pathname?.includes("app") && (
                  <Link href="/app" className="size-full">
                    <ShimmerButton>
                      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                        Dashboard
                      </span>
                    </ShimmerButton>
                  </Link>
                )}
              </div>
            </SignedIn>
            <SignedOut key="sign-in">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="pointer-events-auto"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <SignInButton
                        mode="modal"
                        forceRedirectUrl={
                          process.env.NEXT_PUBLIC_REDIRECT_ROUTE
                        }
                      >
                        <button
                          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/40"
                          aria-label="Sign in or create account"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Get Started</span>
                        </button>
                      </SignInButton>

                      <TooltipContent>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          login
                        </motion.div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </div>
            </SignedOut>
          </AnimatePresence>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-32 lg:grid-cols-2">
        <div>
          {/* Attention: Social Proof */}
          <div className="mb-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-gray-200">
                9.8/10 Rating
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">
                2M+ Creators
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">
                1.7s Generation
              </span>
            </div>
          </div>

          {/* Interest: Problem & Solution Statement */}
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Create Professional
            <span className="ml-2 inline-block">
              <span className="sr-only">
                Create {rotatingTexts.join(", ")} with AI
              </span>
              <span
                className={`text-gradient transition-all duration-200 ${
                  isAnimating
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                aria-hidden="true"
              >
                {rotatingTexts[textIndex]}
              </span>
            </span>
            <span className="text-gradient mt-2 block">in Seconds</span>
          </h1>

          {/* Desire: Value Proposition */}
          <p className="mb-8 text-xl leading-relaxed text-gray-300">
            Skip the expensive photoshoots and endless editing. Generate custom,
            professional-quality visuals for your brand instantly with our
            advanced AI technology.
          </p>

          {/* Action: Clear CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <button
              className="btn btn-primary group flex w-full items-center justify-center gap-2 px-8 py-4 sm:w-auto"
              onClick={() => router.push("/flux-schnell")}
              aria-label="Start creating with VizyAI"
            >
              Try It For Free
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </button>
            <button
              className="group flex w-full items-center justify-center gap-2 text-purple-300 transition-colors hover:text-white sm:w-auto"
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              aria-label="View VizyAI gallery"
            >
              See Examples
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Additional Social Proof */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="mb-4 text-sm text-gray-400">
              Trusted by creative teams worldwide
            </p>
            <div className="flex flex-wrap items-center gap-8 opacity-70 transition-opacity hover:opacity-100">
              {["Uber", "Adidas", "Staples", "Wix"].map((brand) => (
                <span key={brand} className="font-semibold text-gray-400">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="relative">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
              alt="VizyAI platform interface showing instant AI image generation with professional results"
              className="rounded-xl shadow-2xl"
              loading="eager"
              width="800"
              height="600"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 rounded-lg bg-white/10 p-4 shadow-xl backdrop-blur-sm">
            <p className="font-medium text-white">Lightning-fast generation</p>
            <p className="text-sm text-gray-400">Average speed: 1.7 seconds</p>
          </div>
        </div>
      </div>
    </section>
  );
}
