"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ModelInProgressProps {
  isOpen: boolean;
  progress?: number;
}

export function ModelInProgress({
  isOpen,
  progress = 0,
}: ModelInProgressProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Training in Progress</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while your model is being trained. This may take
              several minutes.
            </p>
          </div>

          <div className="w-full space-y-2 px-4">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Processing data and optimizing model...</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
