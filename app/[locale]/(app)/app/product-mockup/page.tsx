"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  DescriptionField,
  InputImagesField,
  ModelNameField,
} from "@/components/product-mockup/FormFields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useCancelTraining } from "@/hooks/productMockup/use-cancel-productMockup";
import { useGetProductMockups } from "@/hooks/productMockup/use-get-productMockup";
import { useSaveProductMockup } from "@/hooks/productMockup/use-save-productMockup";

import {
  defaultValues,
  TrainingConfig,
  trainingConfigSchema,
} from "./constants";

interface Training {
  id: string;
  modelName: string;
  status: string;
  urls: {
    cancel: string;
    stream: string;
    get: string;
  };
}

interface TrainingRowProps {
  training: Training;
  onStatusChange: (id: string, status: string) => void;
  onCancel: (training: Training) => void;
  isCancelling: boolean;
}

function TrainingRow({
  training,
  onStatusChange,
  onCancel,
  isCancelling,
}: TrainingRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { trainingStatus } = useGetProductMockups({
    trainingId: training.id,
    enabled: training.status === "training",
  });

  useEffect(() => {
    if (trainingStatus && trainingStatus !== training.status) {
      onStatusChange(training.id, trainingStatus);
    }
  }, [trainingStatus, training.id, training.status, onStatusChange]);

  // if (isLoading) {
  //   return (
  //     <TableRow className="border-gray-700/50">
  //       <TableCell className="py-4">
  //         <Skeleton className="h-12 w-48" />
  //       </TableCell>
  //       <TableCell className="py-4">
  //         <Skeleton className="h-12 w-32" />
  //       </TableCell>
  //       <TableCell className="py-4">
  //         <Skeleton className="h-10 w-40" />
  //       </TableCell>
  //     </TableRow>
  //   );
  // }

  return (
    <>
      <TableRow className="border-gray-700/50 transition-colors duration-200 hover:bg-gray-800/50">
        <TableCell className="py-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-200">
              {training.modelName}
            </span>
            <span className="text-sm text-gray-400">ID: {training.id}</span>
          </div>
        </TableCell>
        <TableCell className="py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                  training.status === "succeeded"
                    ? "bg-green-500/20 text-green-400"
                    : training.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {training.status === "training" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {training.status}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Started: {new Date().toLocaleDateString()}
            </div>
          </div>
        </TableCell>
        <TableCell className="py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>

            {training.status === "training" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(training)}
                disabled={isCancelling}
                className="flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Training Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about your model training
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-200">Model Information</h4>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-800/50 p-4">
                <div>
                  <p className="text-sm text-gray-400">Model Name</p>
                  <p className="font-medium text-gray-200">
                    {training.modelName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Training ID</p>
                  <p className="font-medium text-gray-200">{training.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium text-gray-200">{training.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Started At</p>
                  <p className="font-medium text-gray-200">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TrainModelForm() {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [open, setOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const form = useForm<TrainingConfig>({
    resolver: zodResolver(trainingConfigSchema),
    defaultValues: {
      ...defaultValues,
      model_name: defaultValues.model_name,
    },
  });

  useEffect(() => {
    const storedTrainings = localStorage.getItem("trainings");
    if (storedTrainings) {
      const parsedTrainings = JSON.parse(storedTrainings);
      // Sort trainings to show running ones first
      const sortedTrainings = parsedTrainings.sort(
        (a: Training, b: Training) => {
          if (a.status === "training" && b.status !== "training") return -1;
          if (a.status !== "training" && b.status === "training") return 1;
          return 0;
        },
      );
      setTrainings(sortedTrainings);
    }
    setIsInitialLoading(false);
  }, []);

  const { saveProductData, isSaving } = useSaveProductMockup((urls) => {
    const newTraining: Training = {
      id: urls.get.split("/").pop() || "",
      modelName: form.getValues("model_name"),
      status: "training",
      urls,
    };

    // Add new training at the beginning since it's running
    const updatedTrainings = [newTraining, ...trainings];
    setTrainings(updatedTrainings);
    localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
    setOpen(false);
  });

  const { cancelTraining, isCancelling } = useCancelTraining(() => {
    toast({
      title: "Success",
      description: "Training cancelled successfully",
    });
  });

  const handleStatusChange = (id: string, status: string) => {
    const updatedTrainings = trainings.map((t) =>
      t.id === id ? { ...t, status } : t,
    );
    // Re-sort trainings after status change
    const sortedTrainings = updatedTrainings.sort((a, b) => {
      if (a.status === "training" && b.status !== "training") return -1;
      if (a.status !== "training" && b.status === "training") return 1;
      return 0;
    });
    setTrainings(sortedTrainings);
    localStorage.setItem("trainings", JSON.stringify(sortedTrainings));
  };

  const handleCancelTraining = async (training: Training) => {
    try {
      await cancelTraining({ trainingId: training.id });
      handleStatusChange(training.id, "cancelled");
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel training",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: TrainingConfig) => {
    try {
      const file = data.input_images;
      if (!file) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      await saveProductData({
        ...defaultValues,
        model_name: form.getValues("model_name"),
        input_images: base64String as string,
        description: form.getValues("description"),
      });

      form.reset({
        ...defaultValues,
        model_name: defaultValues.model_name,
      });
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch {
      console.error("Submission error");
      form.setError("model_name", {
        type: "manual",
        message:
          "Model name already exists or is invalid. Please choose a unique name that contains only letters, numbers, and hyphens.",
      });
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Training</h1>
          <p className="text-muted-foreground">
            Train your models and manage your mockups
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="bg-white text-gray-800 hover:bg-gray-100">
              <Plus className="mr-2 h-4 w-4" />
              New Model
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full border border-gray-700/50 bg-gray-800 bg-opacity-30 backdrop-blur-lg sm:max-w-lg">
            <SheetHeader className="space-y-4 pb-8">
              <SheetTitle className="text-4xl font-bold text-gray-200">
                Train Your Model
              </SheetTitle>
              <SheetDescription className="text-lg text-gray-400">
                Upload your images and configure training parameters to get
                started
              </SheetDescription>
            </SheetHeader>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-8">
                  <ModelNameField control={form.control} />
                  <DescriptionField control={form.control} />
                  <InputImagesField control={form.control} />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="relative w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-6 text-lg font-semibold tracking-wide shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-gray-200">Processing...</span>
                    </div>
                  ) : (
                    <span className="text-gray-200">Start Training</span>
                  )}
                </Button>
              </form>
            </FormProvider>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="w-full rounded-2xl border border-gray-700/50 bg-gray-800 bg-opacity-30 shadow-2xl backdrop-blur-lg">
        <CardHeader className="border-b border-gray-700/50 px-8 pb-8 pt-8">
          <CardTitle className="text-2xl font-bold text-gray-200">
            Trainings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitor and manage your ongoing model trainings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isInitialLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : trainings.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-gray-700/50 bg-gray-900/20 p-8 text-center">
              <div className="rounded-full bg-gray-900/40 p-3">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-200">
                  No trainings yet
                </p>
                <p className="text-sm text-gray-400">
                  Start by creating a new model training
                </p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Model
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Model Name</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => (
                  <TrainingRow
                    key={training.id}
                    training={training}
                    onStatusChange={handleStatusChange}
                    onCancel={handleCancelTraining}
                    isCancelling={isCancelling}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
