import { model, ModelName } from "@/config/constants";

export const types = ["Flux AI", "product"] as const;

export type ModelType = (typeof types)[number];

export interface Model {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  credits?: number;
  strengths?: string;
}

export const TextToImageModel: Model[] = [
  {
    id: model.pro,
    name: ModelName[model.pro],
    description:
      "A distilled version of FLUX.1 that operates up to 10 times faster. text-to-image",
    type: "Flux AI",
    // strengths:
    //   "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: model.schnell,
    name: ModelName[model.schnell],
    description:
      "The pro version of FLUX.1, served in partnership with BFL text-to-image",
    type: "Flux AI",
    // strengths:
    //   "Language translation, complex classification, sentiment, summarization",
  },
  {
    id: model.general,
    name: ModelName[model.general],
    description: "For LoRA use. Choose to see LoRAs.",
    type: "Flux AI",
  },
  {
    id: model.photoGraphy,
    name: ModelName[model.photoGraphy],
    description:
      "A model specifically designed for photography, enhancing image resolution and quality while preserving details",
    type: "Flux AI",
  },
];

export const ImageToImageModel: Model[] = [
  {
    id: model.dev,
    name: ModelName[model.dev],
    description:
      "FLUX.1, a 12B parameters text-to-image model with outstanding aesthetics. text-to-imageinference",
    type: "Flux AI",
  },
  {
    id: model.upscaler,
    name: ModelName[model.upscaler],
    description:
      "An AI upscaler model that enhances image resolution and quality while preserving details",
    type: "Flux AI",
  },
];
