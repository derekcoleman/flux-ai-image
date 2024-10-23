import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "App",
      items: [
        {
          title: "Index",
          href: "/app",
          icon: "HomeIcon",
        },
        {
          title: "TextToImage",
          href: "/app/text-to-image",
          icon: "Eraser",
        },
        {
          title: "ImageToImage",
          href: "/app/image-to-image",
          icon: "Image",
        },
        {
          title: "History",
          href: "/app/history",
          icon: "History",
        },
        // {
        //   title: "GiftCode",
        //   href: "/app/giftcode",
        //   icon: "Gift",
        // },
        {
          title: "ChargeOrder",
          href: "/app/order",
          icon: "billing",
        },
      ],
    },
  ],
};
