import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { appConfig } from "@/shared/config";
import { defaultLocale } from "@/shared/i18n/config";
import { messagesByLocale } from "@/shared/i18n/messages";
import "./globals.css";
import { Providers } from "./providers";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLocale} className={nunitoSans.variable}>
      <body>
        <Providers
          locale={defaultLocale}
          messages={messagesByLocale[defaultLocale]}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
