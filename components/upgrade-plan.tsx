"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Crown, Zap } from "lucide-react";

export default function UpgradePlan() {
  const router = useRouter();
  return (
    <div className="mt-8 px-4">
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="mb-3 flex items-center">
          <Crown className="mr-2 h-5 w-5 text-yellow-300" />
          <span className="font-medium text-white">Upgrade To Pro</span>
        </div>
        <p className="mb-3 text-sm text-gray-200">
          Upgrade to Pro for unlimited generations and premium features
        </p>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-purple-600 transition-colors hover:bg-gray-100"
          onClick={() => router.push("/pricing")}
        >
          <Zap className="h-4 w-4" />
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
