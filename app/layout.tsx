import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/editorial";
import { StoreProvider } from "@/components/store";
import { siteOrigin } from "@/lib/metadata";
import "./globals.css";
const archivo = localFont({
  src: "../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});
const mono = localFont({
  src: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-mono",
  weight: "400",
  display: "swap",
  preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: "SECTION OFFICE",
  icons: { icon: "/icon.svg" },
  robots: { index: false, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <StoreProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
