/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import copy from "copy-to-clipboard";
import { debounce } from "lodash-es";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DownloadAction } from "@/components/history/download-action";
import { GeneratedImages } from "@/components/images/generatedImages";
import { AspectRatioSelector } from "@/components/playground/aspect-selector";
import ComfortingMessages from "@/components/playground/comforting";
import Loading from "@/components/playground/loading";
import { Model } from "@/components/playground/models";
import { PrivateSwitch } from "@/components/playground/private-switch";
import { PricingCardDialog } from "@/components/pricing-cards";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import Upload from "@/components/upload";
import { Locale } from "@/config";
import {
  Credits,
  model,
  ModelName,
  Ratio,
  updateProductModels,
} from "@/config/constants";
import {
  ChargeProductSelectDto,
  FluxSelectDto,
  UserCreditSelectDto,
} from "@/db/type";
import { useGetTrainedModel } from "@/hooks/trainedModel/use-get-trainedModel";
import { useGenerator } from "@/hooks/use-genrator";
import { cn, createRatio } from "@/lib/utils";

const aspectRatios = [
  { Ratio: Ratio.r1, icon: "Square" },
  { Ratio: Ratio.r2, icon: "RectangleHorizontal" },
  { Ratio: Ratio.r3, icon: "RectangleVertical" },
  { Ratio: Ratio.r4, icon: "ThreeByTwo" },
  { Ratio: Ratio.r5, icon: "TwoByThree" },
];

const useCreateTaskMutation = (config?: {
  onSuccess: (result: any) => void;
}) => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (values: any) => {
      console.log("values", values);

      const res = await fetch("/api/generate", {
        body: JSON.stringify(values),
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok && res.status >= 500) {
        throw new Error("Network response error");
      }

      return res.json();
    },
    onSuccess: async (result) => {
      config?.onSuccess(result);
    },
  });
};

export enum FluxTaskStatus {
  Processing = "processing",
  Succeeded = "succeeded",
  Failed = "failed",
  Canceled = "canceled",
}

const PREDEFINED_PROMPTS = [
  {
    label: "Natural & Earthy",
    prompt:
      "natural skincare products placed on a mossy rock surrounded by fern leaves, sunlight filtering through trees, creating a calm and earthy vibe.",
  },
  {
    label: "Coastal & Serene",
    prompt:
      "products displayed on smooth white pebbles near the seashore, with waves softly crashing in the background and seashells scattered around.",
  },
  {
    label: "Garden & Rustic",
    prompt:
      "skincare bottles arranged on a rustic wooden table in a blooming garden, surrounded by vibrant flowers and fresh herbs.",
  },
  {
    label: "Modern & Minimalist",
    prompt:
      "sleek product bottles on a pure white marble surface with soft shadows and clean lines, embodying minimalist luxury.",
  },
  {
    label: "Urban & Industrial",
    prompt:
      "product lineup against exposed brick wall with metal fixtures, soft neon lighting creating an edgy urban atmosphere.",
  },
  {
    label: "Luxe & Glamour",
    prompt:
      "elegant bottles on mirrored surface with gold accents, rose petals scattered around, and soft bokeh lighting effects.",
  },
  {
    label: "Desert & Zen",
    prompt:
      "products artfully placed on sand dunes at sunset, with smooth stones and dried botanicals creating a peaceful desert spa setting.",
  },
  {
    label: "Nordic & Pure",
    prompt:
      "minimalist product arrangement on light wood surface with white ceramics, dried cotton flowers, and diffused natural light.",
  },
  {
    label: "Tropical & Vibrant",
    prompt:
      "products nestled among exotic flowers and monstera leaves, with golden sunlight filtering through palm fronds.",
  },
  {
    label: "Studio & Professional",
    prompt:
      "professional product photography setup with gradient background, precise lighting, and subtle reflections highlighting product details.",
  },
];

interface Prompt {
  label: string;
  prompt: string;
}

interface PromptsModalProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  onSelect: (prompt: string) => void;
  prompts: Prompt[];
}

export function PromptsModal({
  isOpen,
  onClose,
  onSelect,
  prompts,
}: PromptsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select a Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-3 overflow-y-auto pr-2">
          {prompts.map((item) => (
            <div
              key={item.label}
              className="h-auto cursor-pointer justify-start px-4 py-3 text-left transition-colors duration-200 hover:bg-muted/50"
              onClick={() => onSelect(item.prompt)}
            >
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm text-muted-foreground">
                  {item.prompt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Playground({
  locale,
  chargeProduct,
}: {
  locale?: string;
  chargeProduct?: ChargeProductSelectDto[];
}) {
  const { data: trainedModelsData } = useGetTrainedModel();
  const [productMockups, setProductMockups] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductMockups = async () => {
      try {
        const token = await getToken();
        const response = await fetch("/api/products-mockup", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product mockups");
        }

        const data = await response.json();
        if (data.models) {
          setProductMockups(data.models);
          if (data.models.length > 0) {
            const firstModel = {
              id: `vizyai/${data.models[0].modelName}`,
              name: data.models[0].modelName,
              description: data.models[0].description || "No description",
              type: "product" as const,
              triggerWord: data.models[0].triggerWord,
            };
            setSelectedModel(firstModel);
          }
        }
      } catch (error) {
        console.error("Error fetching product mockups:", error);
      }
    };

    fetchProductMockups();
  }, []);

  const models = useMemo(() => {
    return (
      productMockups?.map((m) => ({
        id: `vizyai/${m.modelName}`,
        name: m.modelName,
        description: m.description || "No description",
        type: "product" as const,
        triggerWord: m.triggerWord,
      })) || []
    );
  }, [productMockups]);

  console.log("models", models);

  const [isPublic, setIsPublic] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<Model>({
    id: "Select a model",
    name: "Select a model",
    description: "",
    type: "product" as const,
  });
  const [numberOfImages, setNumberOfImages] = React.useState<number>(1);
  const [ratio, setRatio] = React.useState<Ratio>(Ratio.r1);
  const [loading, setLoading] = useState(false);
  const [fluxId, setFluxId] = useState("");
  const [fluxData, setFluxData] = useState<
    FluxSelectDto & {
      images: {
        id: number;
        fluxId: number;
        imageUrl: string;
        createdAt: string;
        updatedAt: string;
      }[];
    }
  >();
  const useCreateTask = useCreateTaskMutation();

  const [uploadInputImage, setUploadInputImage] = useState<any[]>([]);
  const t = useTranslations("Playground");
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [pricingCardOpen, setPricingCardOpen] = useState(false);
  const [, setResponse] = useState<any>(null);
  const {
    inputPrompt,
    setInputPrompt,
    generatedPrompt,
    handleGenerate,
    loading: isgenerateLoading,
  } = useGenerator();

  const queryTask = useQuery({
    queryKey: ["queryFluxTask", fluxId],
    enabled: !!fluxId,
    refetchInterval: (query) => {
      if (query.state.data?.data?.taskStatus === FluxTaskStatus.Processing) {
        return 2000;
      }
      return false;
    },
    queryFn: async () => {
      const res = await fetch("/api/task", {
        body: JSON.stringify({
          fluxId,
        }),
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok) {
        throw new Error("Network response error");
      }

      return res.json();
    },
  });

  useEffect(() => {
    if (trainedModelsData) {
      updateProductModels(trainedModelsData);
    }
  }, [trainedModelsData]);

  useEffect(() => {
    const key = "GENERATOR_PROMPT";
    const _prompt = window.sessionStorage.getItem(key);
    if (_prompt || generatedPrompt) {
      setInputPrompt(_prompt || generatedPrompt);
      window.sessionStorage.removeItem(key);
    }
  }, [generatedPrompt, setInputPrompt]);

  useEffect(() => {
    const onBeforeunload = () => {
      if (inputPrompt) {
        window.sessionStorage.setItem("GENERATOR_PROMPT", inputPrompt);
      }
    };
    window.addEventListener("beforeunload", onBeforeunload);
  }, [inputPrompt]);

  useEffect(() => {
    if (!queryTask.data?.data?.id) {
      setFluxData(undefined);
      return;
    }

    setFluxData(queryTask?.data?.data);
  }, [queryTask.data]);

  const handleSubmit = async () => {
    if (!inputPrompt) {
      return toast.error("Please enter a prompt");
    }
    const queryData = queryClient.getQueryData([
      "queryUserPoints",
    ]) as UserCreditSelectDto;
    if (queryData?.credit <= 0) {
      toast.error(t("error.insufficientCredits"));
      setPricingCardOpen(true);
      return;
    }
    setLoading(true);

    try {
      const inputImageUrl = uploadInputImage
        ? uploadInputImage?.[0]?.completedUrl
        : undefined;
      const productName = models.find((m) => m.id === selectedModel.id);

      console.log("productName", productName);

      const res = await useCreateTask.mutateAsync({
        model: selectedModel.id,
        inputPrompt,
        aspectRatio: ratio,
        numberOfImages: numberOfImages,
        inputImageUrl,
        isPrivate: isPublic ? 0 : 1,
        locale,
        productName: productName?.triggerWord,
      });
      console.log("res--->", res);
      if (!res.error) {
        setResponse(res);
        setFluxId(res.id);
        queryClient.invalidateQueries({ queryKey: ["queryUserPoints"] });
      } else {
        let error = res.error;
        if (res.code === 1000402) {
          setPricingCardOpen(true);
          error = t("error.insufficientCredits") ?? res.error;
        }
        toast.error(error);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const debounceHandleSubmit = debounce(handleSubmit, 800);

  const generateLoading = useMemo(() => {
    return (
      queryTask.isPending ||
      queryTask.isLoading ||
      fluxData?.taskStatus === FluxTaskStatus.Processing
    );
  }, [fluxData, queryTask]);

  const copyPrompt = (prompt: string) => {
    copy(prompt);
    toast.success(t("action.copySuccess"));
  };

  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);

  const handlePromptSelect = (prompt: string) => {
    setInputPrompt(prompt);
    setIsPromptsModalOpen(false);
  };

  return (
    <>
      <div className="overflow-hidden rounded-[0.5rem] border bg-transparent shadow">
        <div className="container h-full p-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_240px]">
            <div className="flex-col space-y-4 sm:flex md:order-2">
              <div className="grid gap-2">
                <Label htmlFor="model">{t("form.model")}</Label>
                <Select
                  value={selectedModel.id}
                  onValueChange={(value) => {
                    const model = models.find((m) => m.id === value);
                    if (model) {
                      setSelectedModel(model);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model">
                      {selectedModel.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Models</SelectLabel>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <AspectRatioSelector
                aspectRatios={aspectRatios}
                ratio={ratio}
                onChange={setRatio}
              />
              {selectedModel.id !== model.pro && (
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("form.NumberOfImages")}: {numberOfImages}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      {t("form.NumberOfImagesToolTip")}
                    </HoverCardContent>
                  </HoverCard>
                  <Slider
                    defaultValue={[numberOfImages]}
                    max={4}
                    min={1}
                    step={1}
                    className={cn("mt-2 w-full")}
                    onValueChange={(value) => setNumberOfImages(value[0])}
                  />
                </div>
              )}

              {(selectedModel.id === model.dev ||
                selectedModel.id === model.upscaler) && (
                <div className="flx flex-col gap-4">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Label htmlFor="model">{t("form.inputImage")}</Label>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="start"
                      className="w-[260px] text-sm"
                      side="left"
                    >
                      {t("form.inputImageTooltip")}
                    </HoverCardContent>
                  </HoverCard>
                  <Upload
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    placeholder={t("form.inputImagePlaceholder")}
                    value={uploadInputImage}
                    onChange={setUploadInputImage}
                    previewClassName="h-[120px]"
                    accept={{
                      "image/*": [],
                    }}
                  />
                </div>
              )}

              {/* <TemperatureSelector defaultValue={[0.56]} /> */}
              {/* <MaxLengthSelector defaultValue={[256]} /> */}
            </div>
            <div className="md:order-1">
              <div className="flex flex-col space-y-4">
                <div className="grid h-full gap-6 lg:grid-cols-2">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-1 flex-col space-y-2">
                      <div className="mb-2 flex items-center justify-between">
                        <Label htmlFor="input">{t("form.input")}</Label>
                      </div>

                      <Textarea
                        id="input"
                        placeholder={t("form.placeholder")}
                        className="flex-1 bg-transparent lg:min-h-[320px]"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <Label className="text-sm text-muted-foreground">
                            Example prompts
                          </Label>
                        </HoverCardTrigger>
                        <HoverCardContent
                          align="start"
                          className="w-[260px] text-sm"
                          side="left"
                        >
                          Click any example prompt to use it as a starting point
                        </HoverCardContent>
                      </HoverCard>
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_PROMPTS.slice(0, 3).map((item) => (
                          <Button
                            key={item.label}
                            variant="outline"
                            size="sm"
                            className="h-auto rounded-full border border-input/20 px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-muted/50"
                            onClick={() => setInputPrompt(item.prompt)}
                          >
                            <span className="mr-1">✨</span>
                            {item.label}
                            <span className="sr-only">
                              Use example prompt: {item.label}
                            </span>
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full border border-input/20 px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-muted/50"
                          onClick={() => setIsPromptsModalOpen(true)}
                        >
                          More prompts
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label htmlFor="Result mb-2">{t("form.result")}</Label>
                    <div className="min-h-20 rounded-md border-0 md:min-h-[400px] md:border lg:min-h-[450px]">
                      {loading ? (
                        <div className="flex size-full flex-col items-center justify-center">
                          <Loading />
                          <div className="text-content-light mt-3 px-4 text-center text-sm">
                            <ComfortingMessages language={locale as Locale} />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn("size-full", {
                            "bg-muted": !fluxData?.images,
                          })}
                        >
                          <div
                            className={`w-full rounded-md ${createRatio(fluxData?.aspectRatio as Ratio)}`}
                          >
                            {fluxData?.images && fluxData.images.length > 0 && (
                              <GeneratedImages
                                fluxData={fluxData}
                                className={`pointer-events-none w-full rounded-md ${createRatio(fluxData?.aspectRatio as Ratio)}`}
                              />
                            )}
                          </div>
                          <div className="text-content-light inline-block px-4 py-2 text-sm">
                            <p className="line-clamp-4 italic md:line-clamp-6 lg:line-clamp-[8]">
                              {fluxData?.inputPrompt}
                            </p>
                          </div>
                          <div className="flex flex-row flex-wrap space-x-1 px-4">
                            {fluxData?.model?.split?.(":")?.[0] && (
                              <div className="bg-surface-alpha-strong text-content-base inline-flex items-center rounded-md border border-transparent px-1.5 py-0.5 font-mono text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                {ModelName[fluxData?.model.split(":")[0]]}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-row justify-between space-x-2 p-4">
                            {fluxData?.inputPrompt && (
                              <button
                                className="focus-ring text-content-strong border-stroke-strong hover:border-stroke-stronger data-[state=open]:bg-surface-alpha-light inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg border bg-transparent px-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
                                onClick={() =>
                                  fluxData?.inputPrompt &&
                                  copyPrompt(fluxData.inputPrompt)
                                }
                              >
                                <Copy className="icon-xs me-1" />
                                {t("action.copy")}
                              </button>
                            )}

                            {fluxData?.images.length && (
                              <DownloadAction
                                fluxImageIds={fluxData?.images?.map((image) => {
                                  return image.id.toString();
                                })}
                                disabled={!fluxData?.id}
                                id={fluxData?.id ?? ""}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-5">
                  <Button
                    className="w-40"
                    disabled={
                      isgenerateLoading ||
                      !inputPrompt.length ||
                      loading ||
                      (generateLoading && !!fluxId)
                    }
                    onClick={debounceHandleSubmit}
                  >
                    {loading ? (
                      <>
                        <Icons.spinner className="mr-2 size-4 animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      <>
                        {t("form.submit")}
                        <Icons.PointIcon className="size-[14px]" />
                        <span>
                          {selectedModel.type === "product"
                            ? 10 * numberOfImages // Custom models always cost 10 credits
                            : selectedModel.credits
                              ? selectedModel.credits * numberOfImages
                              : Number(Credits[selectedModel.id]) *
                                Number(numberOfImages)}
                        </span>
                      </>
                    )}
                  </Button>
                  <PrivateSwitch isPublic={isPublic} onChange={setIsPublic} />
                  {Boolean(inputPrompt.length) && (
                    <Button
                      onClick={handleGenerate}
                      disabled={loading || isgenerateLoading}
                    >
                      {isgenerateLoading ? (
                        <>
                          <Icons.spinner className="mr-2 size-4 animate-spin" />{" "}
                          Enhancing...
                        </>
                      ) : (
                        <>{t("form.enhance")}</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PromptsModal
        isOpen={isPromptsModalOpen}
        onClose={setIsPromptsModalOpen}
        onSelect={handlePromptSelect}
        prompts={PREDEFINED_PROMPTS}
      />
      <PricingCardDialog
        onClose={setPricingCardOpen}
        isOpen={pricingCardOpen}
        chargeProduct={chargeProduct}
      />
    </>
  );
}
