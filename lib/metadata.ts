import type { Metadata } from "next";
export function validateOrigin(value: string): string {
  const u = new URL(value);
  if (
    !["http:", "https:"].includes(u.protocol) ||
    u.username ||
    u.password ||
    u.search ||
    u.hash ||
    u.pathname !== "/"
  )
    throw new Error(
      "SITE_URL must be a plain HTTP(S) origin without a path, query or credentials.",
    );
  if (
    u.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(u.hostname)
  )
    throw new Error("A public SITE_URL must use HTTPS.");
  if (u.hostname === "example.com" || u.hostname.endsWith(".example"))
    throw new Error("Use an actual public deployment origin.");
  return u.origin;
}
export const siteOrigin = validateOrigin(
  process.env.SITE_URL || "http://localhost:3000",
);
export function pageMetadata(
  title: string,
  description: string,
  path = "/",
  cover = "home",
  type: "website" | "article" = "website",
): Metadata {
  const fullTitle = path === "/" ? title : `${title} — SECTION OFFICE`;
  const image = {
    url: new URL(`/social/${cover}-v1.jpg`, siteOrigin).href,
    width: 1200,
    height: 630,
    alt: `${title} — SECTION / OFFICE architectural portfolio`,
    type: "image/jpeg",
  };
  return {
    metadataBase: new URL(siteOrigin),
    title: fullTitle,
    description,
    alternates: { canonical: new URL(path, siteOrigin).href },
    robots: { index: false, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: new URL(path, siteOrigin).href,
      siteName: "SECTION OFFICE",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
