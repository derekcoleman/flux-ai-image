"use client";

import React, { Fragment, memo, useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/shared/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/types";

import UpgradePlan from "../upgrade-plan";
import { NavBar, NavbarLogo } from "./navbar";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const t = useTranslations("AppNavigation");
  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei
  //
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = window.localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   }
  //   return true;
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.localStorage.setItem(
  //       "sidebarExpanded",
  //       JSON.stringify(isSidebarExpanded),
  //     );
  //   }
  // }, [isSidebarExpanded]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto border-r">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "hidden h-screen md:block",
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px]">
                {isSidebarExpanded ? <NavbarLogo size="2xl" /> : null}

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map((section, i) => (
                  <section
                    key={`section-${i}`}
                    className="flex flex-col gap-0.5"
                  >
                    {isSidebarExpanded ? (
                      <p className="text-xs text-muted-foreground">
                        {section.title}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}
                    {section?.items?.map((item, j) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return item.children ? (
                        isSidebarExpanded ? (
                          <div key={`item-${j}`}>
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-700 hover:text-accent-foreground"
                            >
                              <div className="flex items-center gap-3 rounded-md text-sm font-medium hover:bg-gray-700">
                                <Icon className="size-5" />
                                {t(item.title)}
                              </div>
                              {expandedItems[item.title] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            {/* Child items */}
                            {expandedItems[item.title] && (
                              <div className="ml-11 mt-1 space-y-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.title}
                                    href={child.href}
                                    className={cn(
                                      "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700",
                                      path === child.href
                                        ? "bg-purple-600 text-white"
                                        : "text-muted-foreground hover:text-accent-foreground",
                                      item.disabled &&
                                        "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                    )}
                                  >
                                    {t(child.title)}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Fragment key={`link-fragment-${j}`}>
                            {item.children.map((child) => {
                              const ChildIcon =
                                Icons[child.icon || "arrowRight"];

                              return (
                                <Tooltip key={`tooltip-${child.title}`}>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-gray-700",
                                        path === child.href
                                          ? "bg-purple-600 text-white"
                                          : "text-muted-foreground hover:text-accent-foreground",
                                        item.disabled &&
                                          "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                      )}
                                    >
                                      <span className="flex size-full items-center justify-center">
                                        <ChildIcon className="size-5" />
                                      </span>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="z-50">
                                    {t(child.title)}
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </Fragment>
                        )
                      ) : (
                        <Fragment key={`link-fragment-${j}`}>
                          {isSidebarExpanded ? (
                            <Link
                              key={`link-${item.title}`}
                              href={item.disabled ? "#" : item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-gray-700",
                                path === item.href
                                  ? "bg-purple-600 text-white"
                                  : "text-muted-foreground hover:text-accent-foreground",
                                item.disabled &&
                                  "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                              {t(item.title)}
                              {item.badge && (
                                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ) : (
                            <Tooltip key={`tooltip-${item.title}`}>
                              <TooltipTrigger asChild>
                                <Link
                                  key={`link-tooltip-${item.title}`}
                                  href={item.disabled ? "#" : item.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-gray-700",
                                    path === item.href
                                      ? "bg-purple-600 text-white"
                                      : "text-muted-foreground hover:text-accent-foreground",
                                    item.disabled &&
                                      "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                  )}
                                >
                                  <span className="flex size-full items-center justify-center">
                                    <Icon className="size-5" />
                                  </span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="z-50">
                                {t(item.title)}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </Fragment>
                      );
                    })}
                  </section>
                ))}
              </nav>

              <div className="mt-auto xl:py-4">
                {isSidebarExpanded && <UpgradePlan />}
              </div>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export const MobileSheetSidebar = memo(function MobileSheetSidebar({
  links,
}: DashboardSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();
  const t = useTranslations("AppNavigation");

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <NavBar />

                {links.map((section) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-0.5"
                  >
                    <p className="text-xs text-muted-foreground">
                      {section.title}
                    </p>

                    {section?.items?.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            <Link
                              key={`link-${item.title}`}
                              onClick={() => {
                                if (!item.disabled) setOpen(false);
                              }}
                              href={item.disabled ? "#" : item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                                path === item.href
                                  ? "bg-muted"
                                  : "text-muted-foreground hover:text-accent-foreground",
                                item.disabled &&
                                  "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                              {t(item.title)}
                              {item.badge && (
                                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}

                <div className="mt-auto">{/* <UpgradeCard /> */}</div>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
});
