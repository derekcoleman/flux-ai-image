import React from "react";

import { BookOpen, Users } from "lucide-react";

export function Community() {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold">
              Join Our Creative Community
            </h2>
            <p className="mb-8 text-gray-600">
              Connect with millions of creators, share your work, and get
              inspired. Learn from experts and stay updated with the latest AI
              innovations.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">2M+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">1000+ Tutorials</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
              alt="Community Art 1"
              className="rounded-lg shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?auto=format&fit=crop&q=80"
              alt="Community Art 2"
              className="mt-8 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
