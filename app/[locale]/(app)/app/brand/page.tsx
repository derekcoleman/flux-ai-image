"use client";

import React, { useRef, useState } from "react";

import { Check, FileText, Palette, Plus, Trash2, Upload } from "lucide-react";

interface BrandStyle {
  name: string;
  description: string;
}

interface StyleGuide {
  name: string;
  size: number;
  type: string;
  url: string;
}

const brandStyles: BrandStyle[] = [
  {
    name: "Modern & Minimal",
    description: "Clean, simple, and contemporary design aesthetic",
  },
  {
    name: "Bold & Vibrant",
    description: "Strong colors and dynamic visual elements",
  },
  {
    name: "Classic & Professional",
    description: "Traditional, trustworthy, and sophisticated",
  },
  {
    name: "Playful & Creative",
    description: "Fun, energetic, and imaginative design",
  },
  {
    name: "Luxury & Premium",
    description: "High-end, elegant, and refined aesthetic",
  },
  {
    name: "Tech & Innovation",
    description: "Forward-thinking, digital-first design",
  },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_GUIDE_TYPES = [".pdf", ".ai", ".psd"];

export default function BrandAssets() {
  const [colors, setColors] = useState({
    primary: "#6D28D9",
    secondary: "#EC4899",
    accent: "#10B981",
  });
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [examples, setExamples] = useState<string[]>([]);
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 50MB");
      return;
    }

    // Handle style guide upload
    if (file.name.match(/\.(pdf|ai|psd)$/)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newGuide: StyleGuide = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target?.result as string,
        };
        setStyleGuides([...styleGuides, newGuide]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Check if file is an image
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert("Please upload an image file (JPEG, PNG, or WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setExamples([...examples, e.target?.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const removeStyleGuide = (index: number) => {
    setStyleGuides(styleGuides.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Brand Assets</h1>
        <p className="text-gray-400">
          Define your brand&apos;s visual identity to ensure consistent
          AI-generated content
        </p>
      </div>

      <div className="grid gap-8">
        {/* Brand Colors */}
        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <Palette className="h-5 w-5 text-purple-400" />
            Brand Colors
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium capitalize text-gray-400">
                  {key} Color
                </label>
                <div className="flex gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-gray-700"
                    style={{ backgroundColor: value }}
                  />
                  <input
                    type="color"
                    value={value}
                    onChange={(e) =>
                      setColors((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg bg-gray-700 px-3 py-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Style */}
        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">Brand Style</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brandStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style.name)}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  selectedStyle === style.name
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{style.name}</span>
                  {selectedStyle === style.name && (
                    <Check className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <p className="text-sm text-gray-400">{style.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Style Guide */}
        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">Style Guide</h2>

          {/* Uploaded Files */}
          {styleGuides.length > 0 && (
            <div className="mb-6 space-y-3">
              {styleGuides.map((guide, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">{guide.name}</p>
                      <p className="text-sm text-gray-400">
                        {(guide.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStyleGuide(idx)}
                    className="text-gray-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
          >
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 font-medium text-white">Upload Style Guide</h3>
            <p className="mb-4 text-sm text-gray-400">
              PDF, AI, or PSD files up to 50MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_GUIDE_TYPES.join(",")}
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white"
            >
              Select File
            </button>
          </div>
        </section>

        {/* Brand Examples */}
        <section className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">Brand Examples</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {examples.map((example, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={example}
                  alt={`Brand example ${idx + 1}`}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => removeExample(idx)}
                  className="absolute right-2 top-2 rounded-lg bg-red-500/80 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </button>
              </div>
            ))}

            <input
              ref={imageInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files)
              }
              className="hidden"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 transition-colors hover:border-purple-500 hover:text-purple-400"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm">Add Example</span>
            </button>
          </div>
        </section>

        {/* Save Button */}
        <button className="w-fit rounded-lg bg-purple-600 px-8 py-3 font-medium text-white">
          Save Brand Assets
        </button>
      </div>
    </div>
  );
}
