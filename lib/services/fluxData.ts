import axios from "axios";

interface FluxImageData {
  id: number;
  fluxId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface FluxData {
  id: string;
  userId: string;
  replicateId: string;
  inputPrompt: string;
  executePrompt: string | null;
  steps: number | null;
  guidance: number | null;
  interval: number | null;
  inputImageUrl: string | null;
  model: string;
  executeStartTime: string | null;
  executeEndTime: string | null;
  locale: string;
  aspectRatio: string;
  safetyTolerance: number | null;
  seed: number | null;
  taskStatus: string;
  isPrivate: boolean;
  downloadNum: number;
  viewsNum: number;
  createdAt: string;
  updatedAt: string;
  errorMsg: string | null;
  loraUrl: string | null;
  loraName: string | null;
  loraScale: number | null;
  images: FluxImageData;
  executeTime: number;
}

export interface PaginatedFluxData {
  total: number;
  page: number;
  pageSize: number;
  data: FluxData[];
}

export const getFluxData = async (params: {
  page: number;
  pageSize: number;
  model?: string;
}): Promise<PaginatedFluxData> => {
  const { data } = await axios.get("/api/explore", { params });
  return data.data;
};
