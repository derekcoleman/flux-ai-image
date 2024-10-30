import { notFound } from "next/navigation";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { getFluxById } from "@/actions/flux-action";
import FluxPageClient from "@/components/client/fluxpage-client";
import { Ratio } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { createRatio } from "@/lib/utils";

interface RootPageProps {
  params: { locale: string; slug: string; imageUrlId: string };
}

export async function generateStaticParams() {
  try {
    const fluxs = await prisma.fluxData.findMany({
      where: {
        isPrivate: false,
        taskStatus: {
          in: [FluxTaskStatus.Succeeded],
        },
      },
      select: {
        id: true,
      },
    });
    return fluxs.map((flux) => ({
      slug: FluxHashids.encode(flux.id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params: { locale, slug, imageUrlId },
}: Omit<RootPageProps, "children">) {
  const t = await getTranslations({ locale, namespace: "ExplorePage" });
  const flux = await getFluxById(slug, imageUrlId);

  if (!flux) {
    return notFound();
  }

  return {
    title: t("layout.title"),
    description: flux.inputPrompt,
    openGraph: {
      title: "Flux AI Image Generator",
      description: flux.inputPrompt,
      images: [
        {
          url: flux.imageUrl!,
        },
      ],
      type: "article",
    },
    image: flux.imageUrl,
  };
}

export default async function FluxPage({ params }: RootPageProps) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({
    locale: params.locale,
    namespace: "ExplorePage",
  });

  const flux = await getFluxById(params.slug, params.imageUrlId);
  if (!flux) return notFound();

  // Prepare translation strings to pass as props
  const translationValues = {
    prompt: t("flux.prompt"),
    executePrompt: t("flux.executePrompt"),
    model: t("flux.model"),
    lora: t("flux.lora"),
    resolution: t("flux.resolution"),
    createdAt: t("flux.createdAt"),
  };

  return (
    <section className="container mx-auto py-20">
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="checkerboard flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900 md:w-1/2">
          <img
            src={flux.imageUrl!}
            alt={flux.inputPrompt!}
            title={flux.inputPrompt!}
            className={`h-full rounded-xl object-cover ${createRatio(flux.aspectRatio as Ratio)} pointer-events-none`}
          />
        </div>

        {/* Pass the fetched translation strings as props */}
        <FluxPageClient
          flux={flux}
          imageUrlId={params.imageUrlId}
          locale={params.locale}
          translations={translationValues}
        />
      </div>
    </section>
  );
}
