import { z } from "zod";

export const industries = [
  "Advertising & Marketing",
  "Aerospace & Defense",
  "Agriculture",
  "Artificial Intelligence",
  "Automotive",
  "Banking & Financial Services",
  "Biotechnology",
  "Chemical",
  "Clean Energy",
  "Construction",
  "Consulting",
  "Consumer Electronics",
  "Consumer Goods",
  "Cybersecurity",
  "E-commerce",
  "Education Technology",
  "Entertainment & Media",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Gaming",
  "Government & Public Sector",
  "Healthcare",
  "Hospitality & Tourism",
  "Industrial Manufacturing",
  "Information Technology",
  "Insurance",
  "Internet of Things",
  "Legal Services",
  "Logistics & Supply Chain",
  "Luxury Goods",
  "Machine Learning",
  "Maritime",
  "Medical Devices",
  "Mining & Metals",
  "Non-Profit",
  "Oil & Gas",
  "Pharmaceuticals",
  "Real Estate",
  "Renewable Energy",
  "Retail",
  "Robotics",
  "SaaS",
  "Semiconductors",
  "Social Media",
  "Space Technology",
  "Sports & Recreation",
  "Telecommunications",
  "Transportation",
  "Travel Technology",
  "Utilities",
  "Virtual Reality",
  "Waste Management",
  "Web3 & Blockchain",
] as const;

export const defaultValues = {
  companyName: "",
  websiteUrl: "",
  description: "",
  industry: "",
  targetAudience: "",
};

export const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z
    .string()
    .optional()
    .refine(
      (url) => !url || /^(https?:\/\/)?[a-zA-Z0-9-]+\.[a-zA-Z]+$/.test(url),
      "Must be a valid URL",
    ),
  description: z.string().min(1, "Description is required"),
  industry: z.string().min(1, "Industry is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;
