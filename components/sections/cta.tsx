"use client";

import { useRouter } from "next/navigation";

import { Zap } from "lucide-react";

const CTA = () => {
  const router = useRouter();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-12">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="mb-8 text-gray-200">
            Join thousands of professionals using VizyAI to create stunning
            visuals and streamline their workflow.
          </p>
          <button
            className="mx-auto flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-8 py-4 font-medium text-white transition hover:bg-blue-700"
            aria-label="Get started with VizyAI for free"
          >
            <Zap className="h-5 w-5" aria-hidden="true" />
            <span onClick={() => router.push("/app")}>
              Get Started for Free
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
