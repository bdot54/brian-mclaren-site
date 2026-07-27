import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: {
      default: "Brian D. McLaren — Author, Speaker & Activist",
      template: "%s — Brian D. McLaren",
    },
    description:
      "Explore the books, ideas, events, and speaking work of author, speaker, activist, and public theologian Brian D. McLaren.",
    alternates: { canonical: "/" },
    openGraph: {
      title: "Brian D. McLaren",
      description:
        "Author, speaker, activist, and public theologian exploring faith, courage, and what it means to be human.",
      type: "website",
      url: base,
      images: [
        {
          url: socialImage,
          width: 1731,
          height: 909,
          alt: "Brian D. McLaren — Author, Speaker, Activist",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Brian D. McLaren",
      description:
        "Exploring faith, courage, and what it means to be human.",
      images: [socialImage],
    },
    icons: {
      icon: "/brian-portrait.jpg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
