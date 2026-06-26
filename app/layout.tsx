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
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": [
        { "@type": "Question", "name": "How much does it cost to post a task?", "acceptedAnswer": { "@type": "Answer", "text": "Posting a task on Runly is completely free. You only pay when a runner accepts and completes it." } },
        { "@type": "Question", "name": "Is Runly available across Canada?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Runly is live in Toronto, Hamilton, Vancouver, Ottawa, Calgary, Mississauga, Brampton, Edmonton, and growing." } },
        { "@type": "Question", "name": "How do I know the runner is trustworthy?", "acceptedAnswer": { "@type": "Answer", "text": "Every runner completes identity verification before their first task. You can see their rating, completed task count, and reviews before accepting a bid." } },
        { "@type": "Question", "name": "When does the runner get paid?", "acceptedAnswer": { "@type": "Answer", "text": "Payment is held securely by Runly until you confirm the task is done. The runner only receives payment after you mark the task as complete." } },
        { "@type": "Question", "name": "What kinds of tasks can I post?", "acceptedAnswer": { "@type": "Answer", "text": "Almost anything: parcel pickup and delivery, grocery shopping, sending gifts, home assembly, dog walking, airport drop-offs, admin errands, and more." } },
        { "@type": "Question", "name": "How quickly can a runner start my task?", "acceptedAnswer": { "@type": "Answer", "text": "Most tasks receive bids within 15–30 minutes. Same-day completion is common for delivery and shopping tasks." } },
      ],
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
