import axios from "axios";

export interface ReplicateModel {
  id?: string;
  name: string;
  description?: string;
  visibility?: "public" | "private";
  hardware?: "cpu" | "gpu-t4" | "gpu-a100";
  username?: string;
}

export const createReplicateModel = async (
  modelInfo: ReplicateModel,
): Promise<ReplicateModel> => {
  const { data } = await axios.post<ReplicateModel>(
    "/api/replicate",
    modelInfo,
  );
  return data;
};

interface ModelResponse {
  Models: {
    modelName: string;
    userId: string;
    id: string;
  }[];
}

interface CancelTrainingParams {
  trainingId: string;
}

interface CancelTrainingResponse {
  success: boolean;
  message: string;
}

export const getReplicateModels = async (): Promise<{
  models: ReplicateModel[];
}> => {
  try {
    const response = await axios.get<ModelResponse>("/api/replicate");

    const transformedModels: ReplicateModel[] = response.data.Models.map(
      (model) => ({
        name: model.modelName,
        username: model.userId,
        id: model.id,
      }),
    );

    return { models: transformedModels };
  } catch (error) {
    console.error("Error fetching replicate models:", error);
    return error;
  }
};

export const cancelTrainingRequest = async (
  params: CancelTrainingParams,
): Promise<CancelTrainingResponse> => {
  const { data } = await axios.post<CancelTrainingResponse>(
    `/api/replicate/cancel/${params.trainingId}`,
  );
  return data;
};
