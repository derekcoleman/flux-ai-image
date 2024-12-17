import { z } from "zod";

interface ZipFileInput extends File {
  type: "application/zip" | "application/x-zip-compressed";
}

export const defaultValues = {
  model_name: "",
  steps: 1000,
  lora_rank: 16,
  optimizer: "adamw8bit",
  batch_size: 1,
  resolution: "512,768,1024",
  autocaption: true,
  input_images: undefined,
  trigger_word: "TOK",
  learning_rate: 0.0004,
  wandb_project: "flux_train_replicate",
  wandb_save_interval: 100,
  caption_dropout_rate: 0.05,
  cache_latents_to_disk: false,
  wandb_sample_interval: 100,
};

export const trainingConfigSchema = z.object({
  model_name: z
    .string()
    .min(1, "Model name is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed",
    ),
  steps: z.number().min(3).max(6000),
  lora_rank: z.number().min(4).max(128),
  optimizer: z.string().min(1),
  batch_size: z.number().positive(),
  resolution: z.string().min(1),
  autocaption: z.boolean(),
  input_images: z.custom<ZipFileInput>((val) => {
    if (!(val instanceof File)) return false;
    if (!["application/zip", "application/x-zip-compressed"].includes(val.type))
      return false;
    return true;
  }, "Please upload a ZIP file"),
  trigger_word: z.string().min(1),
  learning_rate: z.number().positive(),
  wandb_project: z.string(),
  wandb_save_interval: z.number().positive(),
  caption_dropout_rate: z.number().min(0).max(1),
  cache_latents_to_disk: z.boolean(),
  wandb_sample_interval: z.number().positive(),
});

export type TrainingConfig = z.infer<typeof trainingConfigSchema>;
