// lib/services/onboardingService.ts
import axios from "axios";

export interface OnboardingAnswers {
  role: string;
  interests: string[];
  designTypes: string[];
  experienceLevel: string;
  goals: string[];
}

export const saveOnboardingAnswers = async (
  answers: OnboardingAnswers,
): Promise<any> => {
  const { data } = await axios.post("/api/onboarding", answers);
  return data;
};

export const getOnboardingAnswers = async (): Promise<any> => {
  const { data } = await axios.get("/api/onboarding");
  return data;
};

export const updateOnboardingAnswers = async (
  answers: Partial<OnboardingAnswers>,
): Promise<any> => {
  const { data } = await axios.put("/api/onboarding", answers);
  return data;
};
