import React from "react";

import { Check, Shield } from "lucide-react";

export function Ownership() {
  return (
    <div className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />
            <div className="relative rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  "Commercial Usage",
                  "Full Ownership",
                  "No Attribution",
                  "Lifetime License",
                  "Print Rights",
                  "Modify & Adapt",
                ].map((right, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2">
              <Shield className="h-8 w-8 text-green-500" />
              <span className="font-semibold text-green-500">
                100% Rights Guaranteed
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white">
              Full Ownership of Your Creations
            </h2>
            <p className="mb-6 text-lg text-gray-300">
              Unlike other AI platforms, VizyAI grants you complete ownership
              and commercial rights to all your generated content. Create with
              confidence knowing your work is truly yours.
            </p>
            <ul className="space-y-4">
              {[
                "Use commercially without restrictions",
                "Modify and adapt your creations freely",
                "No attribution requirements",
                "Perpetual worldwide license",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
