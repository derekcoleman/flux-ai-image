"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useReward } from "react-rewards";

import { BillingFormButton } from "@/components/forms/billing-form-button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import SignBox from "@/components/sign-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ChargeProductSelectDto } from "@/db/type";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { url } from "@/lib";
import { usePathname } from "@/lib/navigation";
import { cn, formatPrice } from "@/lib/utils";

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface PricingCardsProps {
  userId?: string;
  locale?: string;
  chargeProduct?: ChargeProductSelectDto[];
  isHomeScreen?: boolean;
}

const PricingCard = ({
  offer,
  activeType,
  isHomeScreen,
}: {
  userId?: string;
  activeType?: string;
  offer: ChargeProductSelectDto;
  isHomeScreen?: boolean;
}) => {
  const pathname = usePathname();
  const t = useTranslations("PricingPage");

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
        offer.amount === 1990 ? "-m-0.5 border-2 border-purple-400" : "",
      )}
      key={offer.title}
    >
      <div
        className={`min-h-[150px] items-start space-y-4 p-6 ${isHomeScreen ? "bg-[#F5F5F5] text-black" : "bg-muted/50"}`}
      >
        <p
          className={`flex font-urban text-sm font-bold uppercase tracking-wider ${isHomeScreen ? "text-[#737373]" : "text-muted-foreground"}`}
        >
          {offer.title}
        </p>

        <div className="flex flex-row">
          <div className="flex items-end">
            <div className="flex text-left text-3xl font-semibold leading-6">
              {offer.originalAmount && offer.originalAmount > 0 ? (
                <>
                  <span
                    className={`mr-2 text-base ${isHomeScreen ? "text-[#737373]" : "text-muted-foreground/80"} line-through`}
                  >
                    {formatPrice(offer.originalAmount, "$")}
                  </span>
                  <span>{formatPrice(offer.amount, "$")}</span>
                </>
              ) : (
                `${formatPrice(offer.amount, "$")}`
              )}
            </div>
            <div
              className={`-mb-1 ml-2 text-left text-sm font-medium ${isHomeScreen ? "text-[#737373]" : "text-muted-foreground"}`}
            >
              <div>
                {offer.credit} {t("worth")}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`text-left text-sm ${isHomeScreen ? "text-[#737373]" : "text-muted-foreground"}`}
        >
          <div>{t("description")}</div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between gap-16 p-6">
        <div className="flex w-full flex-col gap-6">
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            <div className="text-base font-semibold">Credits per Image:</div>
            {offer.per_image &&
              offer.per_image.split(",")?.map((feature) => (
                <li className="flex items-start gap-x-3" key={feature}>
                  <Icons.check className="size-5 shrink-0 text-purple-500" />
                  <p>{feature}</p>
                </li>
              ))}

            {/* {offer.limitations.length > 0 &&
            offer.limitations.map((feature) => (
              <li
                className="flex items-start text-muted-foreground"
                key={feature}
              >
                <Icons.close className="mr-3 size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))} */}
          </ul>
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            <div className="text-base font-semibold">Credits per Image:</div>
            {offer.maximum_images &&
              offer.maximum_images.split(",")?.map((feature) => (
                <li className="flex items-start gap-x-3" key={feature}>
                  <Icons.check className="size-5 shrink-0 text-purple-500" />
                  <p>{feature}</p>
                </li>
              ))}

            {/* {offer.limitations.length > 0 &&
            offer.limitations.map((feature) => (
              <li
                className="flex items-start text-muted-foreground"
                key={feature}
              >
                <Icons.close className="mr-3 size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))} */}
          </ul>
        </div>

        <SignedIn>
          <BillingFormButton
            offer={offer}
            btnText={
              activeType === "oneTime"
                ? t("action.buy")
                : activeType === "yearly"
                  ? t("action.yearly")
                  : t("action.monthly")
            }
            isHomeScreen={isHomeScreen}
          />
        </SignedIn>

        <SignedOut>
          <div className="flex justify-center">
            <SignInButton mode="modal" forceRedirectUrl={url(pathname).href}>
              <Button
                variant={offer.amount === 1990 ? "default" : "outline"}
                className="w-full"
                // onClick={() => setShowSignInModal(true)}
              >
                {t("action.signin")}
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export function FreeCard() {
  const t = useTranslations("PricingPage");

  return (
    <div
      className={cn(
        "relative col-span-3 flex flex-col overflow-hidden rounded-3xl border shadow-sm lg:col-span-3",
      )}
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Free
        </p>

        <div className="flex flex-row">
          <div className="flex items-end">
            <div className="flex text-left text-3xl font-semibold leading-6">
              {`${formatPrice(0, "$")}`}
            </div>
            <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
              <div>5 {t("worth")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between gap-16 p-6">
        <ul className="space-y-2 text-left text-sm font-medium leading-normal">
          {["Limited models", "Max 5/month Flux.1 Schnell Images"]?.map(
            (feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.check className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ),
          )}

          {["Private Generations", "Commercial License"].map((feature) => (
            <li
              className="flex items-start text-muted-foreground"
              key={feature}
            >
              <Icons.close className="mr-3 size-5 shrink-0" />
              <p>{feature}</p>
            </li>
          ))}
        </ul>
        <SignBox>
          <Button>Try Out</Button>
        </SignBox>
      </div>
    </div>
  );
}

export function PricingCards({
  chargeProduct,
  isHomeScreen,
}: PricingCardsProps) {
  const t = useTranslations("PricingPage");
  const [activeType, setActiveType] = useState<string>("monthly");
  const [filteredChargeProduct, setFilteredChargeProduct] = useState<
    ChargeProductSelectDto[]
  >([]);
  const searchParams = useSearchParams();
  const discount = 0.2;

  useMemo(() => {
    if (activeType === "monthly" || activeType === "yearly") {
      const filters = chargeProduct?.filter((x) => x.type === "monthly");
      if (activeType === "yearly") {
        const updatedPlans = filters?.map((plan) => ({
          ...plan,
          amount: plan.amount - plan.amount * discount,
          originalAmount: plan.originalAmount - plan.originalAmount * discount,
        }));
        setFilteredChargeProduct(updatedPlans || []);
      } else {
        setFilteredChargeProduct(filters || []);
      }
    } else if (activeType === "oneTime") {
      const filters = chargeProduct?.filter((x) => x.type == "oneTime");
      setFilteredChargeProduct(filters || []);
    }
  }, [activeType]);

  const toggleBilling = (value) => {
    setActiveType(value);
  };

  const { reward } = useReward("order-success", "confetti", {
    position: "fixed",
    elementCount: 360,
    spread: 80,
    elementSize: 8,
    lifetime: 400,
  });

  useEffect(() => {
    if (!searchParams.size) {
      return;
    }
    if (searchParams.get("success") === "true") {
      setTimeout(() => {
        reward();
      }, 1000);
    } else if (searchParams.get("success") === "false") {
      console.log("支付失败");
    }
  }, [searchParams]);

  const commonClasses =
    "mb-7 inline-flex items-center justify-between rounded-xl px-2 py-2 pe-4 text-sm md:rounded-full md:px-1 md:py-1";
  const lightModeClasses = "bg-blue-100 text-blue-700 hover:bg-blue-200";
  const darkModeClasses =
    "dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800";

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection label={t("label")} title={t("title")} />
        <div className="mt-4">
          <p
            className={`${commonClasses} ${isHomeScreen ? lightModeClasses : `${lightModeClasses} ${darkModeClasses}`}`}
          >
            <span className="text-sm font-medium">
              {t("tip.title")}&nbsp;(
              {t("tip.subtitle")}&nbsp;
              <a
                href="mailto:hello@vizyai.com"
                className={`font-semibold underline decoration-blue-500 ${isHomeScreen ? "text-blue-700" : "text-blue-700 dark:text-white dark:decoration-white"}`}
              >
                {t("tip.contact")}
              </a>
              &nbsp;)
            </span>
          </p>
        </div>
        <div className="mb-4 mt-10 flex items-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={"monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
          >
            <ToggleGroupItem
              value="oneTime"
              className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle one time billing"
            >
              One Time
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle monthly billing"
            >
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle yearly billing"
            >
              Yearly (-20%)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-5 bg-inherit py-5 md:grid-cols-3">
          {filteredChargeProduct?.map((offer) => (
            <PricingCard
              offer={offer}
              key={offer.id}
              activeType={activeType}
              isHomeScreen={isHomeScreen}
            />
          ))}
        </div>

        {!isHomeScreen && (
          <p className="mt-3 text-balance text-center text-base text-muted-foreground">
            {t("contact.title")}
            <br />
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:hello@vizyai.com"
            >
              hello@vizyai.com
            </a>{" "}
            {t("contact.description")}
          </p>
        )}
      </section>
      <div
        className="pointer-events-none fixed bottom-10 left-[50%] translate-x-[-50%]"
        id="order-success"
      />
    </MaxWidthWrapper>
  );
}

export function PricingCardDialog({
  onClose,
  isOpen,
  chargeProduct,
}: {
  isOpen: boolean;
  chargeProduct?: ChargeProductSelectDto[];
  onClose: (isOpen: boolean) => void;
}) {
  const t = useTranslations("PricingPage");
  // const { isSm, isMobile } = useMediaQuery();
  const [activeType, setActiveType] = useState<string>("monthly");
  const [filteredChargeProduct, setFilteredChargeProduct] = useState<
    ChargeProductSelectDto[]
  >([]);
  const discount = 0.2;

  useMemo(() => {
    if (activeType === "monthly" || activeType === "yearly") {
      const filters = chargeProduct?.filter((x) => x.type == "monthly");
      if (activeType === "yearly") {
        const updatedPlans = filters?.map((plan) => ({
          ...plan,
          amount: plan.amount - plan.amount * discount,
          originalAmount: plan.originalAmount - plan.originalAmount * discount,
        }));
        setFilteredChargeProduct(updatedPlans || []);
      } else {
        setFilteredChargeProduct(filters || []);
      }
    } else if (activeType === "oneTime") {
      const filters = chargeProduct?.filter((x) => x.type == "oneTime");
      setFilteredChargeProduct(filters || []);
    }
  }, [activeType]);

  const toggleBilling = (value) => {
    setActiveType(value);
  };

  // const product = useMemo(() => {
  //   if (isSm || isMobile) {
  //     return ([chargeProduct?.[1]] ?? []) as ChargeProductSelectDto[];
  //   }
  //   return chargeProduct ?? ([] as ChargeProductSelectDto[]);
  // }, [isSm, isMobile]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onClose(open);
      }}
    >
      <DialogContent className="max-h-[90vh] w-[96vw] overflow-y-auto md:w-[960px] md:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <div className="mb-4 flex items-center justify-center gap-5 pt-6">
            <ToggleGroup
              type="single"
              size="sm"
              defaultValue={"monthly"}
              onValueChange={toggleBilling}
              aria-label="toggle-year"
              className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
            >
              <ToggleGroupItem
                value="oneTime"
                className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
                aria-label="Toggle one time billing"
              >
                One Time
              </ToggleGroupItem>
              <ToggleGroupItem
                value="monthly"
                className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
                aria-label="Toggle monthly billing"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yearly"
                className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
                aria-label="Toggle yearly billing"
              >
                Yearly (-20%)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-1 gap-5 bg-inherit py-5 lg:grid-cols-3">
            {filteredChargeProduct?.map((offer) => (
              <PricingCard offer={offer} key={offer.id} />
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
