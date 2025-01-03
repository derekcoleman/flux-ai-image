import { z } from "zod";

interface ZipFileInput extends File {
  type: "application/zip" | "application/x-zip-compressed";
}

export const defaultValues = {
  model_name: "",
  description: "",
  steps: 1000,
  lora_rank: 16,
  optimizer: "adamw8bit",
  batch_size: 1,
  resolution: "512,768,1024",
  autocaption: true,
  input_images: undefined,
  product_name: "",
  trigger_word: "",
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
      /^[a-z0-9._-]+$/,
      "Model name may only contain lowercase letters, numbers, periods, dashes and underscores",
    )
    .regex(
      /^(?![-._]).*[^-._]$/,
      "Model name cannot start or end with a dash, underscore, or period",
    ),
  description: z.string().min(1, "Description is required"),
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
  product_name: z.string().min(1, "Product name is required"),
  trigger_word: z.string(),
  learning_rate: z.number().positive(),
  wandb_project: z.string(),
  wandb_save_interval: z.number().positive(),
  caption_dropout_rate: z.number().min(0).max(1),
  cache_latents_to_disk: z.boolean(),
  wandb_sample_interval: z.number().positive(),
});

export type TrainingConfig = z.infer<typeof trainingConfigSchema>;
