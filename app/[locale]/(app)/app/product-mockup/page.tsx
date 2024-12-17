"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  AutoCaptionField,
  BatchSizeField,
  CacheLatentsField,
  CaptionDropoutRateField,
  InputImagesField,
  LearningRateField,
  LoRARankField,
  ModelNameField,
  OptimizerField,
  ResolutionField,
  StepsField,
  TriggerWordField,
  WandbProjectField,
  WandbSampleIntervalField,
  WandbSaveIntervalField,
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
import { useSaveProductMockup } from "@/hooks/productMockup/use-save-productMockup";

import {
  defaultValues,
  TrainingConfig,
  trainingConfigSchema,
} from "./constants";

export default function TrainModelForm() {
  const { saveProductData, isSaving } = useSaveProductMockup(() =>
    form.reset(defaultValues),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<TrainingConfig>({
    resolver: zodResolver(trainingConfigSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: TrainingConfig) => {
    try {
      setProgress(0);
      const file = data.input_images;

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      await saveProductData({
        ...data,
        input_images: base64String as string,
      });

      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Training Configuration
          </CardTitle>
          <CardDescription>
            Configure your model training parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ModelNameField control={form.control} models={["ok"]} />
              <InputImagesField control={form.control} />
              <TriggerWordField control={form.control} />
              <AutoCaptionField control={form.control} />
              <StepsField control={form.control} />
              <LoRARankField control={form.control} />
              <WandbProjectField control={form.control} />

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-left text-sm hover:bg-gray-700"
              >
                <span>
                  <span className="font-medium">Advanced Settings</span>
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Including Learning Rate and 7 more...
                  </span>
                </span>
                {showAdvanced ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              {showAdvanced && (
                <>
                  <LearningRateField control={form.control} />
                  <BatchSizeField control={form.control} />
                  <ResolutionField control={form.control} />
                  <CaptionDropoutRateField control={form.control} />
                  <OptimizerField control={form.control} />
                  <CacheLatentsField control={form.control} />
                  <WandbSampleIntervalField control={form.control} />
                  <WandbSaveIntervalField control={form.control} />
                </>
              )}

              <Button type="submit" disabled={false} className="w-full">
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Create Training"
                )}
              </Button>
              <ModelInProgress isOpen={isSaving} progress={progress} />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
