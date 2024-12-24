"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  DescriptionField,
  InputImagesField,
  ModelNameField,
} from "@/components/product-mockup/FormFields";
import { ModelInProgress } from "@/components/product-mockup/ModelInProgress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSaveProductMockup } from "@/hooks/productMockup/use-save-productMockup";

import {
  defaultValues,
  TrainingConfig,
  trainingConfigSchema,
} from "./constants";

export default function TrainModelForm() {
  const { toast } = useToast();
  const [urls, setUrls] = useState<{
    cancel: string;
    stream: string;
    get: string;
  } | null>();
  const [isModelStarted, setIsModelStarted] = useState(false);

  const form = useForm<TrainingConfig>({
    resolver: zodResolver(trainingConfigSchema),
    defaultValues: {
      ...defaultValues,
      model_name: defaultValues.model_name,
    },
  });

  useEffect(() => {
    const storedTrainingData = localStorage.getItem("modelTrainingData");
    if (storedTrainingData) {
      const { urls: storedUrls } = JSON.parse(storedTrainingData);
      console.log({ storedUrls });
      setUrls(storedUrls);
      setIsModelStarted(true);
    }
  }, []);

  const { saveProductData, isSaving, error } = useSaveProductMockup((urls) => {
    setUrls(urls);
    setIsModelStarted(true);
    localStorage.setItem(
      "modelTrainingData",
      JSON.stringify({
        urls,
        modelName: form.getValues("model_name"),
      }),
    );
  });

  console.log({ error });

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
    } catch (error) {
      console.error("Submission error:", error);
      // The toast for the error is already shown in the mutation's onError

      setUrls(null);
      setIsModelStarted(false);

      form.setError("model_name", {
        type: "manual",
        message:
          "Model name already exists or is invalid. Please choose a unique name that contains only letters, numbers, and hyphens.",
      });
    }
  };

  const handleCloseModal = () => {
    if (!isModelStarted) {
      setUrls(null);
      form.reset({
        ...defaultValues,
        model_name: defaultValues.model_name,
      });
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-2xl rounded-2xl border border-gray-700/50 bg-gray-800 bg-opacity-30 shadow-2xl backdrop-blur-lg">
        <CardHeader className="space-y-4 border-b border-gray-700/50 px-8 pb-8 pt-8">
          <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
            Train Your Model
          </CardTitle>
          <CardDescription className="text-lg text-gray-300">
            Upload your images and configure training parameters to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-8">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <span className="text-white">Processing...</span>
                  </div>
                ) : (
                  <span className="text-white">Start Training</span>
                )}
              </Button>

              <ModelInProgress
                isOpen={isSaving || !!urls || isModelStarted}
                urls={urls}
                onClose={handleCloseModal}
                setIsModelStarted={setIsModelStarted}
              />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
