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
          icon: "Wand2",
        },
        {
          title: "ImageToImage",
          href: "/app/image-to-image",
          icon: "Image",
        },
        {
          title: "ImageToVideo",
          href: "/app/image-to-video",
          icon: "Video",
        },

        {
          title: "Images",
          href: "/app/images",
          icon: "Images",
        },
        {
          title: "Marketing",
          icon: "Megaphone",
          children: [
            {
              title: "productMockUps",
              href: "/app/product-mockup",
              icon: "Layers2",
            },
          ],
        },
        {
          title: "Company",
          icon: "Building",
          children: [
            {
              title: "CompanyInformation",
              href: "/app/company",
              icon: "Building2",
            },
            {
              title: "BrandAssets",
              href: "/app/brand",
              icon: "Target",
            },
            {
              title: "Products&Services",
              href: "/app/products",
              icon: "FolderKanban",
            },
          ],
        },
        {
          title: "ChargeOrder",
          href: "/app/order",
          icon: "billing",
        },
        {
          title: "History",
          href: "/app/history",
          icon: "History",
        },
        {
          title: "Settings",
          href: "/app/settings",
          icon: "Settings",
        },
      ],
    },
  ],
};

// {
//   title: "GiftCode",
//   href: "/app/giftcode",
//   icon: "Gift",
// },
