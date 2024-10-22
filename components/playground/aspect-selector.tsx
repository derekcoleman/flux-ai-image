"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import { Icons } from "@/components/shared/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ratio } from "@/config/constants";

interface AspectRatio {
  Ratio: Ratio;
  icon: string; // This will restrict it to valid keys in the Icons object
}

interface SelectorProps {
  ratio: Ratio;
  aspectRatios: AspectRatio[];
  className?: string;
  onChange: (ratio: Ratio) => void;
}

export function AspectRatioSelector({
  aspectRatios,
  ratio,
  onChange,
}: SelectorProps) {
  const t = useTranslations("Playground");

  return (
    <Tabs value={ratio} onValueChange={(value) => onChange(value as Ratio)}>
      <div className="grid gap-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <span className="text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("form.aspectRatio")}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-[320px] text-sm" side="left">
            {t("form.aspectRatioTooltip")}
          </HoverCardContent>
        </HoverCard>

        <TabsList className="grid grid-cols-5">
          {aspectRatios.map((ratio) => {
            const Icon = Icons[ratio.icon || "arrowRight"];
            return (
              <TabsTrigger key={ratio.Ratio} value={ratio.Ratio}>
                <div className="flex flex-col items-center">
                  <Icon className="size-5" />
                  {ratio.Ratio}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </Tabs>
  );
}
