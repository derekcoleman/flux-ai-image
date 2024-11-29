import React from "react";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import BillingsInfo from "@/components/billing-info";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale, namespace: "Billings" });

  return {
    title: t("page.title"),
    description: t("page.description"),
  };
}
export default async function DashboardPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);

  return <BillingsInfo />;
}

// "use client";

// const historyItems = [
//   {
//     id: 1,
//     type: "Text to Image",
//     prompt: "A futuristic cityscape at night with neon lights",
//     date: "2024-03-15T10:30:00",
//     image:
//       "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80",
//   },
//   {
//     id: 2,
//     type: "Image to Image",
//     prompt: "Convert to watercolor style",
//     date: "2024-03-15T09:15:00",
//     image:
//       "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80",
//   },
// ];

// export default function History() {
//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="mb-2 text-3xl font-bold text-white">
//           Generation History
//         </h1>
//         <p className="text-gray-400">
//           View and manage your previous generations
//         </p>
//       </div>

//       <div className="grid gap-6">
//         {historyItems.map((item) => (
//           <div key={item.id} className="rounded-xl bg-gray-800 p-6">
//             <div className="flex items-start gap-6">
//               <img
//                 src={item.image}
//                 alt={item.prompt}
//                 className="h-40 w-40 rounded-lg object-cover"
//               />
//               <div className="flex-1">
//                 <div className="mb-2 flex items-center justify-between">
//                   <span className="text-sm font-medium text-purple-400">
//                     {item.type}
//                   </span>
//                   <span className="text-sm text-gray-400">
//                     {new Date(item.date).toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="mb-4 font-medium text-white">{item.prompt}</p>
//                 <div className="flex items-center gap-4">
//                   <button className="text-gray-400 transition-colors hover:text-white">
//                     <Download className="h-5 w-5" />
//                   </button>
//                   <button className="text-gray-400 transition-colors hover:text-white">
//                     <Share2 className="h-5 w-5" />
//                   </button>
//                   <button className="text-gray-400 transition-colors hover:text-red-500">
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
