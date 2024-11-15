"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does our AI image generator work?",
    answer:
      "Our AI image generator uses a state-of-the-art model trained on a diverse dataset of images and text. When you input a description, the AI processes it to understand the context and visual elements mentioned. It then synthesizes an image from scratch, ensuring that the generated image is both unique and aligned with your description.",
  },
  {
    question: "Can I use the generated images commercially?",
    answer:
      "Yes! With our Pro and Enterprise plans, you get full commercial usage rights for all generated images. The Starter plan is limited to personal use only.",
  },
  {
    question: "How long does it take to generate an image?",
    answer:
      "Most images are generated within 2-3 seconds. Complex requests or higher resolutions might take slightly longer, but we're constantly optimizing our infrastructure for speed.",
  },
  {
    question: "Can I edit the generated images?",
    answer:
      "Absolutely! Our built-in editing suite allows you to refine and adjust generated images. Pro and Enterprise plans include advanced editing features for more control.",
  },
  {
    question: "What are the limitations of using an AI image generator?",
    answer:
      "While our AI image generator is powerful, there are limitations. The accuracy of the generated images can vary based on the complexity and specificity of the input description. Additionally, the AI may struggle with extremely abstract concepts or very detailed requests that go beyond its training data.",
  },
  {
    question: "What makes Vizy AI different from other AI image generators?",
    answer:
      "Vizy AI combines speed, quality, and ease of use. It's faster than Midjourney, more user-friendly than ComfyUI, and produces higher quality images than many competitors.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white py-24 text-black" id="support">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about VizyAI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <button
                className="flex w-full items-center justify-between bg-white px-6 py-4 transition-colors hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-left font-medium">{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === idx && (
                <div className="bg-gray-50 px-6 py-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Still have questions?</p>
          <a
            href="mailto:hello@vizyai.com"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
