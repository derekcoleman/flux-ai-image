import { z } from "zod";

export const categories = [
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
];

export const defaultValues = {
  name: "",
  description: "",
  price: "",
  currency: "",
  frequency: "",
  images: [],
  category: "",
};

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export const frequencies = [
  { value: "one-time", label: "One-time payment" },
  { value: "hourly", label: "Per hour" },
  { value: "daily", label: "Per day" },
  { value: "weekly", label: "Per week" },
  { value: "monthly", label: "Per month" },
  { value: "yearly", label: "Per year" },
];

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  frequency: z.string().min(1, "Frequency is required"),
  images: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
});

export type productInfo = z.infer<typeof productSchema>;
