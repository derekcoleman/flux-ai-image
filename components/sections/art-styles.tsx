import React from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

const previewStyles = [
  {
    name: "Photorealistic",
    image:
      "https://i.pinimg.com/564x/41/98/ff/4198ffb1a0397f4dbf7988f213281f3a.jpg",
    description: "Ultra-realistic images indistinguishable from photographs",
  },
  {
    name: "Anime & Manga",
    image:
      "https://i.pinimg.com/564x/51/49/ea/5149eaef0d6c1fb3559c86d1e49fc963.jpg",
    description: "Japanese animation and comic book style artwork",
  },
  {
    name: "Half Illustration",
    image:
      "https://i.pinimg.com/564x/7e/80/14/7e80146d4bbca6edbea76cfbc0ad8c97.jpg",
    description: "Combine photorealism with illustrations",
  },
  {
    name: "Illustration",
    image:
      "https://i.pinimg.com/564x/dd/4a/5b/dd4a5bf4d858797f0842d8dbde001e9d.jpg",
    description: "Modern rendered artwork and illustrations",
  },
];

export function ArtStyles() {
  return (
    <div id="art-styles" className="bg-gradient-main py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Endless Style Possibilities
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-400">
            Express your creativity through various artistic styles and mediums
          </p>
          <Link
            href="/styles"
            className="btn btn-primary inline-flex items-center"
            aria-label="View all available art styles"
          >
            Explore All Styles{" "}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {previewStyles.map((style, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={style.image}
                alt={`Example of ${style.name} art style`}
                className="h-80 w-full transform object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                width="400"
                height="400"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {style.name}
                </h3>
                <p className="text-sm text-gray-300">{style.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
