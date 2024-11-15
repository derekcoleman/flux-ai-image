import { unstable_setRequestLocale } from "next-intl/server";

import { ArtStyles } from "@/components/sections/art-styles";
import { Community } from "@/components/sections/community";
import CTA from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Gallery } from "@/components/sections/gallery";
import HeroLanding from "@/components/sections/hero-landing";
import { Ownership } from "@/components/sections/ownership";
import { Pricing } from "@/components/sections/pricing";
import { Ratings } from "@/components/sections/ratings";
import TwitterList from "@/components/sections/twitter-list";
import { UseCases } from "@/components/sections/use-cases";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <div className="bg-black">
      <HeroLanding />
      <UseCases />
      <Features />
      <Ratings />
      <ArtStyles />
      <Gallery />
      <Ownership />
      <Pricing />
      <FAQ />
      {/* <Community /> */}
      <CTA />
      {process.env.NODE_ENV === "production" && <TwitterList />}
    </div>
  );
}
