"use client";

import React, { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import {
  Bell,
  Briefcase,
  CreditCard,
  Shield,
  Target,
  User,
} from "lucide-react";

import { useGetOnboarding } from "@/hooks/onboarding/use-get-onboarding";
import { useUpdateOnboarding } from "@/hooks/onboarding/use-update-onboarding";

type Preferences = {
  role: string;
  interests: string[];
  designTypes: string[];
  experienceLevel: string;
  goals: string[];
};

const roles = [
  { id: "marketer", label: "Marketing Professional", icon: Target },
  { id: "designer", label: "Designer", icon: Target },
  { id: "business_owner", label: "Business Owner", icon: Briefcase },
  { id: "content_creator", label: "Content Creator", icon: Target },
  { id: "agency", label: "Agency", icon: Target },
  { id: "other", label: "Other", icon: Target },
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

export default function Settings() {
  const { updateOnBoardingData, isUpdating } = useUpdateOnboarding();

  const { data } = useGetOnboarding();
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    role: "",
    interests: [],
    designTypes: [],
    experienceLevel: "",
    goals: [],
  });

  const handlePreferenceChange = (
    key: keyof Preferences,
    value: Preferences[typeof key],
  ) => {
    if (preferences[key] === value) return;
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    setIsEditing(true);
  };

  const handleArrayPreferenceToggle = (key: string, value: string) => {
    const array = preferences[key] || [];
    const newArray = array.includes(value)
      ? array.length > 1
        ? array.filter((item: string) => item !== value)
        : array
      : [...array, value];
    setPreferences({ ...preferences, [key]: newArray });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (data) {
      setPreferences({
        role: data.role || "",
        interests: data.interests || [],
        designTypes: data.designTypes || [],
        experienceLevel: data.experienceLevel || "",
        goals: data.goals || [],
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = () => {
    updateOnBoardingData(preferences);
    setIsEditing(false);
  };

  useEffect(() => {
    if (data) {
      setPreferences({
        role: data.role || "",
        interests: data.interests || [],
        designTypes: data.designTypes || [],
        experienceLevel: data.experienceLevel || "",
        goals: data.goals || [],
      });
    }
  }, [data]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="grid gap-8">
        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <User className="h-5 w-5" />
            Profile Settings
          </h2>
          <div className="grid max-w-xl gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                defaultValue={user?.fullName || ""}
                disabled
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                defaultValue={user?.primaryEmailAddress?.emailAddress}
                disabled
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Role & Experience
          </h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Your Role
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handlePreferenceChange("role", role.id)}
                    className={`rounded-lg border-2 p-3 transition-colors ${
                      preferences.role === role.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Experience Level
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() =>
                      handlePreferenceChange("experienceLevel", level.id)
                    }
                    className={`rounded-lg border-2 p-3 transition-colors ${
                      preferences.experienceLevel === level.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <span className="block font-medium">{level.label}</span>
                    <span className="text-sm text-gray-400">
                      {level.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Interests & Goals
          </h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Interests
              </label>
              <div className="grid gap-2 md:grid-cols-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() =>
                      handleArrayPreferenceToggle("interests", interest)
                    }
                    className={`rounded-lg border-2 p-2 transition-colors ${
                      preferences.interests?.includes(interest)
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Design Types
              </label>
              <div className="grid gap-2 md:grid-cols-3">
                {designTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      handleArrayPreferenceToggle("designTypes", type)
                    }
                    className={`rounded-lg border-2 p-2 transition-colors ${
                      preferences.designTypes?.includes(type)
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Goals
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleArrayPreferenceToggle("goals", goal)}
                    className={`rounded-lg border-2 p-2 transition-colors ${
                      preferences.goals?.includes(goal)
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="rounded-lg border-2 border-gray-500 border-transparent px-4 py-2 font-medium text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/40"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <CreditCard className="h-5 w-5" />
            Subscription
          </h2>
          <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-600/20 p-4">
            <p className="font-medium text-white">Current Plan: Free</p>
            <p className="text-sm text-gray-300">100 credits remaining</p>
          </div>
          <button className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white">
            Upgrade Plan
          </button>
        </section>

        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <span className="text-gray-300">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" defaultChecked />
              <span className="text-gray-300">Generation completed alerts</span>
            </label>
          </div>
        </section>

        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <Shield className="h-5 w-5" />
            Security
          </h2>
          <button className="rounded-lg bg-gray-700 px-6 py-2 font-medium text-white">
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
}
