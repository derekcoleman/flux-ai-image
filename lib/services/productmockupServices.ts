import { File } from "buffer";
import axios from "axios";

export interface Productmockup {
  model_name: string;
  steps: number;
  lora_rank: number;
  optimizer: string;
  batch_size: number;
  resolution: string;
  autocaption: boolean;
  input_images: string | Blob | File | null;
  trigger_word: string;
  learning_rate: number;
  wandb_project: string;
  wandb_save_interval: number;
  caption_dropout_rate: number;
  cache_latents_to_disk: boolean;
  wandb_sample_interval: number;
}

export const saveProductMockup = async (
  productMockupInfo: Productmockup,
): Promise<Productmockup> => {
  const { data } = await axios.post<Productmockup>(
    "/api/products-mockup",
    productMockupInfo,
  );
  return data;
};

export const CreateReplicateModel = async (
  productMockupInfo: Productmockup,
): Promise<Productmockup> => {
  const { data } = await axios.post<Productmockup>(
    "/api/products-mockup",
    productMockupInfo,
  );
  return data;
};
