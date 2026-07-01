import { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/db/queries";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ShoppingBag, ArrowRight, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Products for Developers and Founders | LahbabiGuide",
  description: "Premium guides, cheat sheets, and templates for startup founders and developers. Download PDF resources and curated startup toolkits.",
  alternates: { canonical: "https://lahbabiguide.com/products" },
  openGraph: {
    title: "Digital Products for Developers and Founders",
    description: "Premium guides, cheat sheets, and templates for startup founders and developers.",
    url: "https://lahbabiguide.com/products",
  },
};

export const revalidate = 3600;

export default async function ProductsIndexPage() {
  const products = await getProducts();
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "LahbabiGuide Digital Products",
          url: "https://lahbabiguide.com/products",
          description: "Digital products for developers and founders: PDF guides, cheat sheets, and templates.",
        }}
      </JsonLd>
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Products", url: "https://lahbabiguide.com/products" }]} />
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <ShoppingBag className="h-3.5 w-3.5" />
            Digital Products
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Premium Guides for Builders
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Practical PDF guides, cheat sheets, and templates that complement the LahbabiGuide directory and save you research time.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <article key={product.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">{product.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{product.price}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{product.format}</span>
              </div>
              <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition">
                View Product <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
