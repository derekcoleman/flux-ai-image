"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Examples from "./examples";

export function Gallery() {
  const router = useRouter();
  return (
    <div className="bg-black py-24" id="gallery">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16">
          <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Community Masterpieces
          </h2>
          <p className="max-w-2xl text-lg text-gray-400">
            Discover what's possible with VizyAI. Browse through our curated
            collection of community-generated artwork and get inspired.
          </p>
        </div>

        <Examples />

        <div className="mt-12 text-center">
          <button
            className="btn btn-primary"
            onClick={() => router.push("/explore")}
          >
            View More Creations
          </button>
        </div>
      </div>
    </div>
  );
}
