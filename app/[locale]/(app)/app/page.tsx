import { Images, Layers, Maximize, Palette, Video, Wand2 } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import DashboardContent from "@/components/dashboard/dashboard-content";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale, namespace: "Billings" });

  return {
    title: t("page.title"),
    description: t("page.description"),
  };
}

export default function DashboardPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);

  return <DashboardContent />;
}
