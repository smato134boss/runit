import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://runly.ca";
const TITLE = "Runly — Your neighbour will handle it";
const DESC = "Post any errand or task — a verified runner in your Canadian city picks it up and gets it done. Same-day delivery, grocery runs, home tasks, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: "%s | Runly",
  },
  description: DESC,
  keywords: ["task marketplace", "errand service", "delivery Canada", "runners Canada", "same day delivery Toronto", "grocery delivery Hamilton", "task app Canada"],
  authors: [{ name: "Runly" }],
  creator: "Runly",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "d4Y4GSwByh2iaredP-dhCWeA1s7hLC_-zgs7WdM-FmY",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "Runly",
    title: TITLE,
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    site: "@runlyca",
    creator: "@runlyca",
    title: TITLE,
    description: DESC,
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Runly",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
      sameAs: [
        "https://twitter.com/runlyca",
        "https://instagram.com/runlyca",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English", "French"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Runly",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/tasks/browse?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/#service`,
      name: "Runly Task Marketplace",
      provider: { "@id": `${BASE_URL}/#organization` },
      description: DESC,
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
      serviceType: "Task Marketplace",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
