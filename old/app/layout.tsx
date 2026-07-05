import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Geeta Diabetes And Endocrine Centre | Endocrinologist in Ongole",
    template: "%s | Geeta Diabetes And Endocrine Centre",
  },
  description:
    "Dr. Geeta Annamaneni, MBBS, MD, DM (Endocrinology), provides specialist care for diabetes, thyroid, PCOS, obesity, and endocrine disorders in Ongole, Andhra Pradesh.",
  keywords: [
    "best endocrinologist in Ongole",
    "Endocrinologist Ongole",
    "Diabetes doctor Ongole",
    "Thyroid specialist Andhra Pradesh",
    "PCOS specialist Ongole",
    "hormone specialist Ongole",
    "diabetes clinic Ongole",
    "Dr Geeta Annamaneni",
    "Geeta Diabetes and Endocrine Centre",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Geeta Diabetes And Endocrine Centre",
    title: "Geeta Diabetes And Endocrine Centre | Endocrinologist in Ongole",
    description:
      "Specialist endocrine and diabetes care in Ongole with Dr. Geeta Annamaneni (DM Endocrinology).",
    images: [
      {
        url: "/images/doctor.jpeg",
        width: 1200,
        height: 630,
        alt: "Dr. Geeta Annamaneni - Endocrinologist in Ongole",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geeta Diabetes And Endocrine Centre | Endocrinologist in Ongole",
    description:
      "Diabetes, thyroid, PCOS, obesity, and endocrine care in Ongole.",
    images: ["/images/doctor.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "healthcare",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@500;600;700&family=Noto+Sans+Telugu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
