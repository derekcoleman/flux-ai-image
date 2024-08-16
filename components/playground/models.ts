export const types = ["Flux AI"] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}

export const models: Model<ModelType>[] = [
  {
    id: "black-forest-labs/flux-pro",
    name: "FLUX.1 [pro]",
    description:
      "A distilled version of FLUX.1 that operates up to 10 times faster. text-to-image",
    type: "Flux AI",
    // strengths:
    //   "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "black-forest-labs/flux-schnell",
    name: "FLUX.1 [schnell]",
    description: "The pro version of FLUX.1, served in partnership with BFL text-to-image",
    type: "Flux AI",
    // strengths:
    //   "Language translation, complex classification, sentiment, summarization",
  },
  {
    id: "black-forest-labs/flux-dev",
    name: "FLUX.1 [dev]",
    description: "FLUX.1, a 12B parameters text-to-image model with outstanding aesthetics. text-to-imageinference",
    type: "Flux AI",
  }
];