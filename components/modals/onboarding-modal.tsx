"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { useSaveOnboarding } from "@/hooks/onboarding/use-save-onboarding";

const roles = [
  { id: "marketer", label: "Marketing Professional", icon: Target },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "business_owner", label: "Business Owner", icon: Briefcase },
  { id: "content_creator", label: "Content Creator", icon: Sparkles },
  { id: "agency", label: "Agency", icon: Zap },
  { id: "other", label: "Other", icon: CheckCircle },
];

const interests = [
  "Advertising",
  "Architecture",
  "Art & Illustration",
  "Brand Design",
  "E-commerce",
  "Fashion",
  "Interior Design",
  "Marketing",
  "Photography",
  "Product Design",
  "Social Media",
  "UI/UX Design",
  "Video Production",
  "Web Design",
];

const designTypes = [
  "Product Photography",
  "Marketing Materials",
  "Social Media Content",
  "Brand Assets",
  "Website Graphics",
  "Presentations",
  "Digital Ads",
  "Email Designs",
  "Package Design",
  "Logo Design",
  "Illustrations",
  "Video Thumbnails",
];

const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "New to AI design tools" },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some experience with AI tools",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Regular user of AI tools",
  },
  { id: "expert", label: "Expert", description: "Professional AI tool user" },
];

const goals = [
  "Increase Productivity",
  "Reduce Design Costs",
  "Improve Content Quality",
  "Scale Content Creation",
  "Automate Design Process",
  "Learn AI Design",
  "Build Brand Consistency",
  "Generate More Ideas",
];

export function OnboardingModal({ handleClose }) {
  const { saveOnboardingData, isSaving } = useSaveOnboarding();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    role: "",
    interests: [] as string[],
    designTypes: [] as string[],
    experienceLevel: "",
    goals: [] as string[],
  });

  const steps = [
    {
      title: "What's your role?",
      description: "Help us customize your experience",
      component: (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setAnswers({ ...answers, role: role.id })}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                answers.role === role.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <role.icon className="h-5 w-5 text-purple-400" />
              <span className="text-white">{role.label}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What are your interests?",
      description: "Select all that apply",
      component: (
        <div className="grid gap-3 md:grid-cols-3">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => {
                const newInterests = answers.interests.includes(interest)
                  ? answers.interests.filter((i) => i !== interest)
                  : [...answers.interests, interest];
                setAnswers({ ...answers, interests: newInterests });
              }}
              className={`rounded-lg border-2 p-3 transition-colors ${
                answers.interests.includes(interest)
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <span className="text-white">{interest}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What will you create?",
      description: "Select the types of designs you're interested in",
      component: (
        <div className="grid gap-3 md:grid-cols-3">
          {designTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                const newTypes = answers.designTypes.includes(type)
                  ? answers.designTypes.filter((t) => t !== type)
                  : [...answers.designTypes, type];
                setAnswers({ ...answers, designTypes: newTypes });
              }}
              className={`rounded-lg border-2 p-3 transition-colors ${
                answers.designTypes.includes(type)
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <span className="text-white">{type}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your experience level?",
      description: "With AI design tools",
      component: (
        <div className="grid gap-4">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() =>
                setAnswers({ ...answers, experienceLevel: level.id })
              }
              className={`flex flex-col items-start rounded-lg border-2 p-4 transition-colors ${
                answers.experienceLevel === level.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <span className="mb-1 font-medium text-white">{level.label}</span>
              <span className="text-sm text-gray-400">{level.description}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What are your goals?",
      description: "Select all that apply",
      component: (
        <div className="grid gap-3 md:grid-cols-2">
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => {
                const newGoals = answers.goals.includes(goal)
                  ? answers.goals.filter((g) => g !== goal)
                  : [...answers.goals, goal];
                setAnswers({ ...answers, goals: newGoals });
              }}
              className={`rounded-lg border-2 p-3 transition-colors ${
                answers.goals.includes(goal)
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <span className="text-white">{goal}</span>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      saveOnboardingData(answers);
      handleClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-gray-800">
        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-8 h-1 w-full rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-white">
                  {steps[step].title}
                </h2>
                <p className="text-gray-400">{steps[step].description}</p>
              </div>

              {steps[step].component}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between border-t border-gray-700 p-6">
          <button
            onClick={handleBack}
            disabled={isSaving}
            className={`flex items-center gap-2 text-gray-400 transition-colors hover:text-white ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
          >
            {isSaving ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                {step === steps.length - 1 ? "Get Started" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
