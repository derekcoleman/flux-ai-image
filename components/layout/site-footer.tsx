import React from "react";

import { Github, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold text-white">
              Vizy<span className="text-purple-400">AI</span>
            </div>
            <p className="text-gray-400">
              Empowering creativity through artificial intelligence
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/#features" className="cursor-pointer">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="cursor-pointer">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#gallery" className="cursor-pointer">
                  Gallery
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>Tutorials</li>
              <li>Blog</li>
              <li>
                <a href="/#support" className="cursor-pointer">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <div className="flex gap-4">
              <Github className="h-6 w-6 cursor-pointer text-gray-400 hover:text-white" />
              <Twitter className="h-6 w-6 cursor-pointer text-gray-400 hover:text-white" />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 Create AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
