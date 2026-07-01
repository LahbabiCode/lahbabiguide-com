import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { Sparkles, Wrench, Menu, Globe, ShieldAlert, Award, Search, BookOpen, Layers, Scale, Trophy, BadgeDollarSign } from "lucide-react";
import { Metadata } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_OG_IMAGE, ADSENSE_CLIENT_ID } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "LahbabiGuide - Free Developer Tools, Startup Credits & Platform Reviews",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    "free developer tools",
    "startup credits",
    "AWS Activate credits",
    "Google Cloud startup credits",
    "developer platform directory",
    "JSON formatter",
    "JWT decoder",
    "Base64 encoder",
    "UUID generator",
    "tech stack comparisons",
    "SaaS discounts",
    "cloud credits for startups",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Technology",
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  alternates: {
    // NOTE: root canonical is set per-page (e.g. HomePage sets "/"). We do not
    // declare a global "/" canonical here because Next.js would let it leak onto
    // child routes. Each page sets its own alternates.canonical instead.
    languages: {
      "en-US": SITE_URL,
      "x-default": SITE_URL,
    },
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
  openGraph: {
    title: "LahbabiGuide - Developer Tools, Startup Credits & Platform Reviews",
    description:
      "Browse free developer tools, verified startup credit programs, cloud grants, SaaS discounts, and objective platform comparisons for modern engineering teams.",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "LahbabiGuide - Free Developer Tools and Startup Credits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LahbabiGuide - Free Developer Tools & Startup Credits",
    description:
      "Your all-in-one hub for free developer utilities, verified startup credits, and platform reviews.",
    images: [SITE_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "Curated directory of free developer tools, verified startup credits, and platform reviews.",
              foundingDate: "2024",
              founder: {
                "@type": "Person",
                name: "Zakaria Lahbabi",
              },
              sameAs: [SITE_URL],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "contact@lahbabiguide.com",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "Free developer tools, verified startup credits, cloud grants, SaaS discounts, and platform comparisons.",
              publisher: {
                "@type": "Organization",
                name: SITE_NAME,
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
                <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased text-[#0F172A] bg-[#F8FAFC] dark:bg-[#0B1120] dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 transition-colors">
          <div className="container mx-auto px-4 max-w-7xl h-14 md:h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-[8px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-2 rounded-xl bg-blue-600 text-white font-black text-sm shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center w-9 h-9">
                  LG
                </div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-display font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  Lahbabi<span className="text-blue-600">Guide</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Directory Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-bold text-slate-600 dark:text-slate-400">
              <Link href="/tools" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Tools
              </Link>
              <Link href="/credits" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-emerald-500" />
                Credits
              </Link>
              <Link href="/directory" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Platforms
              </Link>
              <Link href="/compare" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 transition flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-pink-500" />
                Compare
              </Link>
              <Link href="/best" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 transition flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Best
              </Link>
              <Link href="/pricing" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition flex items-center gap-1.5">
                <BadgeDollarSign className="h-3.5 w-3.5 text-emerald-500" />
                Pricing
              </Link>
              <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Blog
              </Link>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-2" />
              <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">About</Link>
              <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">Contact</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center h-9 px-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-400 group cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition">
                <Search className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium mr-4">Quick Search...</span>
                <span className="text-[10px] font-black border border-slate-300 dark:border-slate-700 rounded px-1 min-w-[20px] text-center">/</span>
              </div>
              <Link
                href="/admin"
                className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
              >
                <Menu className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Unified Banner for AdSense / Sticky Info */}
        <div className="w-full bg-blue-600 dark:bg-blue-700 py-1.5 text-center text-[11px] font-bold text-white uppercase tracking-[0.2em]">
          Free Startup Credits & Developer Assets Index
        </div>

        {/* Content Wrapper */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <footer className="w-full bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-slate-500 dark:text-slate-400 mt-auto transition-colors font-sans px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white font-black text-xs shadow-md">LG</div>
                  <span className="font-display font-black text-xl text-slate-900 dark:text-white">LahbabiGuide</span>
                </Link>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
                  The ultimate hub for developers and founders. curated tools, verified credits, and professional platform reviews designed to speed up your growth.
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer">
                    <Globe className="h-4 w-4" />
                  </div>
                  {/* Additional social icons could go here */}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-widest mb-6">Directory</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link href="/tools" className="hover:text-blue-600 transition">Web Utilities Index</Link></li>
                  <li><Link href="/credits" className="hover:text-emerald-500 transition">Startup Credits Log</Link></li>
                  <li><Link href="/directory" className="hover:text-blue-600 transition">Hosting Platforms</Link></li>
                  <li><Link href="/compare" className="hover:text-pink-600 transition">Stack Comparisons</Link></li>
                  <li><Link href="/best" className="hover:text-amber-500 transition">Best-of Guides</Link></li>
                  <li><Link href="/pricing" className="hover:text-emerald-500 transition">Pricing Guides</Link></li>
                  <li><Link href="/startup-credits" className="hover:text-blue-600 transition">Credit Clusters</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-widest mb-6">Learning</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link href="/blog" className="hover:text-blue-600 transition">Engineering Blog</Link></li>
                  <li><Link href="/guides" className="hover:text-blue-600 transition">Startup Guides</Link></li>
                  <li><Link href="/resources" className="hover:text-blue-600 transition">Resource Hub</Link></li>
                  <li><Link href="/products" className="hover:text-blue-600 transition">Digital Products</Link></li>
                  <li><Link href="/sponsor" className="hover:text-amber-500 transition">Sponsor a Listing</Link></li>
                  <li><Link href="/partners" className="hover:text-blue-600 transition">Direct Partnerships</Link></li>
                  <li><Link href="/sitemap" className="hover:text-blue-600 transition">HTML Sitemap</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 transition">Our Mission</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-widest mb-6">Compliance</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400 dark:text-slate-600">
                  <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition underline underline-offset-4 decoration-slate-200">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition underline underline-offset-4 decoration-slate-200">Terms of Use</Link></li>
                  <li><Link href="/editorial-policy" className="hover:text-slate-900 dark:hover:text-white transition underline underline-offset-4 decoration-slate-200">Editorial Policy</Link></li>
                  <li><Link href="/advertising-disclosure" className="hover:text-slate-900 dark:hover:text-white transition underline underline-offset-4 decoration-slate-200">Advertising Disclosure</Link></li>
                  <li><Link href="/ads.txt" className="hover:text-slate-900 dark:hover:text-white transition font-mono text-[10px]">ads.txt</Link></li>
                  <li><Link href="/robots.txt" className="hover:text-slate-900 dark:hover:text-white transition font-mono text-[10px]">robots.txt</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-600 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <span>&copy; {new Date().getFullYear()} LahbabiGuide Portal.</span>
                <span className="hidden md:block w-1 h-1 bg-slate-300 dark:bg-slate-800 rounded-full" />
                <span>Precision SEO Engineering.</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time ISR Active
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
