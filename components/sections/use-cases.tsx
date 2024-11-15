"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Building,
  Camera,
  CheckCircle,
  Megaphone,
  Palette,
  PenTool,
  ShoppingBag,
} from "lucide-react";

const useCases = [
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "E-commerce",
    description:
      "Create professional product photos and lifestyle shots instantly",
    benefits: [
      "Cut photography costs by 80%",
      "Generate unlimited variations",
      "Consistent brand style",
    ],
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: <Megaphone className="h-6 w-6" />,
    title: "Marketing",
    description: "Generate scroll-stopping social media content and ads",
    benefits: [
      "Fresh content daily",
      "Boost engagement rates",
      "Scale content creation",
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <PenTool className="h-6 w-6" />,
    title: "Design",
    description: "Create logos, illustrations, and brand assets in minutes",
    benefits: [
      "Unlimited design iterations",
      "Consistent brand identity",
      "Rapid prototyping",
    ],
    gradient: "from-pink-500 to-red-500",
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: "Real Estate",
    description: "Visualize spaces and create stunning property showcases",
    benefits: [
      "Virtual staging",
      "Property modifications",
      "Architectural renders",
    ],
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Content Creation",
    description:
      "Generate unique visuals for blogs, websites, and social media",
    benefits: ["Original imagery", "Custom art styles", "Rapid production"],
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Art & NFTs",
    description: "Create unique digital art and collectibles",
    benefits: ["Unique art styles", "High-resolution output", "Batch creation"],
    gradient: "from-yellow-500 to-green-500",
  },
];

export function UseCases() {
  const router = useRouter();

  return (
    <div className="bg-gradient-secondary py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Attention & Interest */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block font-medium text-purple-400">
            Trusted by 20,000+ businesses
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white">
            AI-Powered Solutions for Every Industry
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Join industry leaders who've transformed their creative workflow
            with VizyAI. Generate professional content 10x faster at a fraction
            of the cost.
          </p>
        </div>

        {/* Desire: Use Cases Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="group relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} rounded-xl opacity-25 blur transition-opacity group-hover:opacity-50`}
              />
              <div className="relative h-full rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-purple-500">
                <div
                  className={`h-12 w-12 bg-gradient-to-r ${useCase.gradient} mb-4 flex items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110`}
                >
                  {useCase.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {useCase.title}
                </h3>
                <p className="mb-4 text-gray-400">{useCase.description}</p>
                <ul className="mb-6 space-y-2">
                  {useCase.benefits.map((benefit, bidx) => (
                    <li
                      key={bidx}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="group/btn inline-flex items-center text-sm text-purple-400 hover:text-purple-300">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-16 text-center">
          <button
            className="btn btn-primary group inline-flex items-center gap-2"
            onClick={() => router.push("/app/text-to-image")}
          >
            Start Creating Today
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-gray-400">Instant access • Pay as you grow</p>
        </div>
      </div>
    </div>
  );
}
