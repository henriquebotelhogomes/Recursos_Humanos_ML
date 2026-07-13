import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name} — People Analytics`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
