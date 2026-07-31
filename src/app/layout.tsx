import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import "@/app/globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "Operations dashboard for The Gentleman BarberShop and Spa.",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("gentleman-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          id="theme-initializer"
        />
      </head>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
