import React from "react";

interface GalleryItem {
  images: {
    imageUrl: string;
  };
  inputPrompt: string;
}

export function CommunityGallery({ data }: { data: GalleryItem[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {data.map((item, i) => {
        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl bg-gray-800"
          >
            <img
              src={item.images.imageUrl}
              alt={item.inputPrompt}
              className="aspect-square w-full transform object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute bottom-0 w-full p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex gap-2"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
