import { Play, Upload } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import Playground from "@/components/playground";
import { getChargeProduct } from "@/db/queries/charge-product";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale, namespace: "Playground" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PlaygroundPage({
  params: { locale },
}: PageProps) {
  unstable_setRequestLocale(locale);
  const { data: chargeProduct } = await getChargeProduct(locale);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Image to Video</h1>
        <p className="text-gray-400">
          Bring your images to life with AI-powered animation
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-gray-800 p-8">
          <div className="rounded-xl border-2 border-dashed border-gray-700 p-8 text-center">
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 font-medium text-white">Upload Source Image</h3>
            <p className="mb-4 text-sm text-gray-400">
              Select an image to animate
            </p>
            <button className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white">
              Select File
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 p-8">
          <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-700">
            <Play className="h-12 w-12 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-gray-400">Preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
