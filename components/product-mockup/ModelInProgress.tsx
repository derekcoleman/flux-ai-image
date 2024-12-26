"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCancelTraining } from "@/hooks/productMockup/use-cancel-productMockup";
import { useGetProductMockups } from "@/hooks/productMockup/use-get-productMockup";

interface ModelInProgressProps {
  isOpen: boolean;
  urls: { cancel: string; stream: string; get: string } | null;
  onClose: () => void;
  setIsModelStarted: (value: boolean) => void;
}

export function ModelInProgress({
  isOpen,
  urls,
  onClose,
  setIsModelStarted,
}: ModelInProgressProps) {
  const [isCancelled, setIsCancelled] = React.useState(false);
  const { toast } = useToast();
  const { cancelTraining, isCancelling } = useCancelTraining(() => {
    onClose();
  });

  const { trainingStatus, isLoading, failedReason, cancelQuery } =
    useGetProductMockups({
      trainingId: urls?.get.split("/").pop() || "",
      enabled: isOpen && !isCancelled,
    });

  React.useEffect(() => {
    if (trainingStatus === "succeeded") {
      toast({
        title: "Success",
        description: "Model training completed successfully!",
      });
      setIsModelStarted(false);
      localStorage.removeItem("modelTrainingData");
      onClose();
    } else if (trainingStatus === "failed") {
      toast({
        title: "Training Failed",
        description: failedReason || "Training process failed",
        variant: "destructive",
      });
      setIsModelStarted(false);
      localStorage.removeItem("modelTrainingData");
      onClose();
    }
  }, [trainingStatus, failedReason, onClose, setIsModelStarted, toast]);

  const handleCancel = async () => {
    setIsCancelled(true);
    cancelQuery();
    if (!urls?.get.split("/").pop()) return;
    setIsModelStarted(false);
    localStorage.removeItem("modelTrainingData");
    cancelTraining({ trainingId: urls?.get.split("/").pop() || "" });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsModelStarted(false);
        onClose();
      }}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-[425px] [&>button]:hidden">
        <div className="flex flex-col space-y-8 p-6">
          {/* Animated Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="absolute left-0 top-0 h-full w-1/2 animate-[progress_2s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">
                Training Your Model
              </h3>
              <p className="text-sm text-muted-foreground">
                We&apos;re training an AI model specifically for your product.
                This typically takes 20-30 minutes.
              </p>
              {failedReason && trainingStatus === "failed" && (
                <p className="text-sm text-red-500">Error: {failedReason}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {!isLoading
                    ? "Validating training data..."
                    : "Optimizing model parameters..."}
                </span>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          {urls?.cancel && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling
                  </span>
                ) : (
                  "Cancel"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
