"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Cpu,
  Image as ImageIcon,
  Layers,
  Palette,
  RefreshCcw,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
  benefit,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
}) {
  return (
    <div className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-purple-500">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800/50 transition group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-3 text-gray-400">{description}</p>
      <p className="text-sm text-purple-400">{benefit}</p>
    </div>
  );
}

export function Features() {
  const router = useRouter();
  return (
    <div className="relative bg-black py-24" id="features">
      <div className="mx-auto max-w-7xl px-4">
        {/* Attention & Interest */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Industry-Leading AI Technology
            </span>
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Every Tool You Need to Create
            <br />
            Professional Content
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Transform your creative workflow with our comprehensive suite of AI
            tools. Generate, edit, and enhance content faster than ever before.
          </p>
        </div>

        {/* Desire: Feature Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-blue-500" />}
            title="Text to Image"
            description="Transform descriptions into stunning visuals instantly"
            benefit="Save 90% on design time"
          />
          <FeatureCard
            icon={<RefreshCcw className="h-6 w-6 text-purple-500" />}
            title="Image Variations"
            description="Generate multiple versions of your designs"
            benefit="Perfect your vision faster"
          />
          <FeatureCard
            icon={<Video className="h-6 w-6 text-pink-500" />}
            title="Video Generation"
            description="Create dynamic video content from text"
            benefit="Cut video production costs"
          />
          <FeatureCard
            icon={<Wand2 className="h-6 w-6 text-green-500" />}
            title="Smart Enhancement"
            description="Automatically improve image quality"
            benefit="Professional results instantly"
          />
          <FeatureCard
            icon={<Palette className="h-6 w-6 text-yellow-500" />}
            title="Style Library"
            description="Access hundreds of premium art styles"
            benefit="Stand out from competitors"
          />
          <FeatureCard
            icon={<ImageIcon className="h-6 w-6 text-red-500" />}
            title="Batch Processing"
            description="Create multiple images simultaneously"
            benefit="10x your productivity"
          />
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-indigo-500" />}
            title="Custom Training"
            description="Train AI on your brand's unique style"
            benefit="Maintain brand consistency"
          />
          <FeatureCard
            icon={<Cpu className="h-6 w-6 text-cyan-500" />}
            title="API Access"
            description="Integrate AI into your applications"
            benefit="Scale your creativity"
          />
        </div>

        {/* Action */}
        <div className="mt-16 text-center">
          <button
            className="btn btn-primary group inline-flex items-center gap-2"
            onClick={() => router.push("/app/image-to-image")}
          >
            Start Creating Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-gray-400">
            Plans from $9.99/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
