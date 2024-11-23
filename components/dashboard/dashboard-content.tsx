// export default function DashboardContent() {
//   const { user } = useUser();
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   console.log(
//     user?.publicMetadata?.popupSeen === false && isModalOpen,
//     user?.publicMetadata?.popupSeen === false,
//     isModalOpen,
//   );

//   return (
//     <>
//       <div className="space-y-12 p-8">
//         {/* Hero Section */}
//         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900">
//           <div className="bg-grid-white/5 absolute inset-0" />
//           <div className="relative p-8 md:p-12">
//             <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
//               Bring your ideas to life
//             </h1>
//             <p className="mb-6 text-xl text-gray-200">
//               One platform, infinite possibilities
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button className="btn btn-primary inline-flex items-center gap-2">
//                 <Zap className="h-5 w-5" />
//                 Quick Start
//               </button>
//               <button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20">
//                 <BookOpen className="h-5 w-5" />
//                 View Tutorials
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tools Grid */}
//         <div>
//           <h2 className="mb-6 text-2xl font-bold text-white">AI Tools</h2>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {tools.map((tool) => (
//               <Link
//                 key={tool.name}
//                 href={tool.to}
//                 className="group relative rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500 hover:bg-gray-800"
//               >
//                 <div
//                   className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${tool.gradient} rounded-t-xl opacity-50 transition-opacity group-hover:opacity-100`}
//                 />
//                 <tool.icon className="mb-4 h-8 w-8 text-white transition-transform group-hover:scale-110" />

//                 <h3 className="mb-2 text-xl font-semibold text-white">
//                   {tool.name}
//                 </h3>
//                 <p className="text-gray-400">{tool.description}</p>
//                 <div className="mt-4 inline-flex items-center text-sm text-purple-400 group-hover:text-purple-300">
//                   <span>Get started</span>
//                   <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Featured Guides */}
//         <div>
//           <h2 className="mb-6 text-2xl font-bold text-white">
//             Featured Guides
//           </h2>
//           <div className="grid gap-6 md:grid-cols-3">
//             {guides.map((guide) => (
//               <div
//                 key={guide.title}
//                 className="group relative overflow-hidden rounded-xl"
//               >
//                 <img
//                   src={guide.image}
//                   alt={guide.title}
//                   className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
//                   <div className="absolute bottom-0 p-6">
//                     <span className="mb-2 inline-block rounded-full bg-purple-500/80 px-3 py-1 text-sm text-white">
//                       {guide.tag}
//                     </span>
//                     <h3 className="mb-1 text-lg font-semibold text-white">
//                       {guide.title}
//                     </h3>
//                     <p className="text-sm text-gray-300">{guide.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Community Gallery */}
//         <div>
//           <div className="mb-6 flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-white">
//               Community Creations
//             </h2>
//             <div className="flex gap-4">
//               <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
//                 <Star className="h-5 w-5" />
//                 Popular
//               </button>
//               <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
//                 Latest
//               </button>
//             </div>
//           </div>
//           {/* <CommunityGaller /> */}
//         </div>
//       </div>
//       <AnimatePresence>
//         {user?.publicMetadata?.popupSeen === false && isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <OnboardingModal
//               handleClose={() => {
//                 setIsModalOpen(false);
//               }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Images, Layers, Maximize, Palette, Video, Wand2 } from "lucide-react";

import { OnboardingModal } from "../modals/onboarding-modal";
import { Skeleton } from "../ui/skeleton";

// "use client";

// import { useState } from "react";
// import Link from "next/link";

// import { useUser } from "@clerk/nextjs";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   BookOpen,
//   Images,
//   Layers,
//   Loader2,
//   Maximize,
//   Palette,
//   Sparkles,
//   Star,
//   Video,
//   Wand2,
//   Zap,
// } from "lucide-react";

// import { OnboardingModal } from "../modals/onboarding-modal";

export default function DashboardContent() {
  const { user, isLoaded } = useUser(); // Extract isLoaded
  const [isModalOpen, setIsModalOpen] = useState(true);

  console.log(user?.publicMetadata?.popupSeen);

  const tools = [
    {
      name: "Text to Image",
      description: "Transform text into visuals",
      icon: Wand2,
      to: "/app/text-to-image",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      name: "Image to Image",
      description: "Style transfer & variations",
      icon: Images,
      to: "/app/image-to-image",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      name: "Image to Video",
      description: "Animate your images",
      icon: Video,
      to: "/app/image-to-video",
      gradient: "from-green-600 to-blue-600",
    },
    {
      name: "Upscaler",
      description: "Enhance image quality",
      icon: Maximize,
      to: "/app/upscaler",
      gradient: "from-orange-600 to-red-600",
    },
    {
      name: "Style Library",
      description: "Browse art styles",
      icon: Palette,
      to: "/app/styles",
      gradient: "from-pink-600 to-rose-600",
    },
    {
      name: "Canvas Editor",
      description: "Advanced editing tools",
      icon: Layers,
      to: "/app/editor",
      gradient: "from-indigo-600 to-blue-600",
    },
  ];

  const guides = [
    {
      title: "Style Reference",
      description: "Learn how to use style references effectively",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
      tag: "How to Use",
    },
    {
      title: "Content Reference",
      description: "Master content-aware generation",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80",
      tag: "Tutorial",
    },
    {
      title: "Advanced Techniques",
      description: "Pro tips for better results",
      image:
        "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?auto=format&fit=crop&q=80",
      tag: "Advanced",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="space-y-12 p-8">
        <Skeleton className="h-64 w-full rounded-2xl bg-gray-700" />

        <div>
          <Skeleton className="mb-4 h-10 w-1/4 bg-gray-700" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-40 w-full rounded-xl bg-gray-700"
              />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="mb-4 h-10 w-1/4 bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-48 w-full rounded-xl bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12 p-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="bg-grid-white/5 absolute inset-0" />
          <div className="relative p-8 md:p-12">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Bring your ideas to life
            </h1>
            <p className="mb-6 text-xl text-gray-200">
              One platform, infinite possibilities
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary inline-flex items-center gap-2">
                Quick Start
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20">
                View Tutorials
              </button>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">AI Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.to}
                className="group relative rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500 hover:bg-gray-800"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${tool.gradient} rounded-t-xl opacity-50 transition-opacity group-hover:opacity-100`}
                />
                <tool.icon className="mb-4 h-8 w-8 text-white transition-transform group-hover:scale-110" />

                <h3 className="mb-2 text-xl font-semibold text-white">
                  {tool.name}
                </h3>
                <p className="text-gray-400">{tool.description}</p>
                <div className="mt-4 inline-flex items-center text-sm text-purple-400 group-hover:text-purple-300">
                  <span>Get started</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Guides */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">
            Featured Guides
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <div
                key={guide.title}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 p-6">
                    <span className="mb-2 inline-block rounded-full bg-purple-500/80 px-3 py-1 text-sm text-white">
                      {guide.tag}
                    </span>
                    <h3 className="mb-1 text-lg font-semibold text-white">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-300">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {user?.publicMetadata?.popupSeen === false && isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingModal
              handleClose={() => {
                setIsModalOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
