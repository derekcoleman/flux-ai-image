// lib/services/companyInformationService.ts
import axios from "axios";

export interface CompanyInformation {
  companyName: string;
  websiteUrl: string;
  description: string;
  targetAudience: string;
  industry: string;
  companyLogo: string | null;
}

export const saveCompanyInformation = async (
  companyInfo: CompanyInformation,
): Promise<CompanyInformation> => {
  const { data } = await axios.post<CompanyInformation>(
    "/api/company",
    companyInfo,
  );
  return data;
};

export const getCompanyInformation = async (): Promise<CompanyInformation> => {
  const { data } = await axios.get("/api/company");
  return data;
};

export const updateCompanyInformation = async (
  companyInfo: Partial<CompanyInformation>,
): Promise<CompanyInformation> => {
  const { data } = await axios.put("/api/company", companyInfo);
  return data;
};
