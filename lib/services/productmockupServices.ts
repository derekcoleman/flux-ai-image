import { File } from "buffer";
import axios from "axios";

export interface GetProductMockupParams {
  trainingId: string;
  signal?: AbortSignal;
}

export interface Productmockup {
  model_name: string;
  description: string;
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
  trainingId?: string;
}

export const saveProductMockup = async (
  productMockupInfo: Productmockup,
): Promise<Productmockup> => {
  try {
    const { data } = await axios.post<Productmockup>(
      "/api/products-mockup",
      productMockupInfo,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product mockup",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const CreateReplicateModel = async (
  productMockupInfo: Productmockup,
): Promise<Productmockup> => {
  try {
    const { data } = await axios.post<Productmockup>(
      "/api/products-mockup",
      productMockupInfo,
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getProductTrainingStatus = async ({
  trainingId,
  signal,
}: GetProductMockupParams): Promise<{
  productMockup: Productmockup;
  trainingStatus: string;
}> => {
  try {
    const { data } = await axios.get<{
      productMockup: Productmockup;
      trainingStatus: string;
    }>(`/api/products-mockup?trainingId=${trainingId}`, {
      signal,
    });

    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("Request cancelled");
    }
    throw error;
  }
};
