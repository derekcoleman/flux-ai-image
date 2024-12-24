import axios from "axios";

import { TrainedModel } from "@/config/constants";

export const getTrainedModels = async (): Promise<TrainedModel[]> => {
  const { data } = await axios.get<{ data: TrainedModel[] }>("/api/models");
  return data.data;
};
