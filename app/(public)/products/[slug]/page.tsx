import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db/queries";
import { JsonLd, BreadcrumbSchema, FaqSchema } from "@/components/seo/JsonLd";
import { ArrowLeft, ShoppingBag, CheckCircle2, Download } from "lucide-react";
import { ProductLeadForm } from "@/components/product/ProductLeadForm";

interface ProductProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | LahbabiGuide" };
  const url = `https://lahbabiguide.com/products/${product.slug}`;
  return {
    title: `${product.seoTitle} | LahbabiGuide`,
    description: product.seoDescription,
    keywords: product.tags,
    alternates: { canonical: url },
    openGraph: { title: product.title, description: product.seoDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: product.seoTitle, description: product.seoDescription },
  };
}

export default async function ProductDetailPage({ params }: ProductProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const url = `https://lahbabiguide.com/products/${product.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Products", url: "https://lahbabiguide.com/products" }, { name: product.title, url }]} />
      {product.faqs && product.faqs.length > 0 && <FaqSchema faqs={product.faqs} />}
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: product.title,
          url,
          description: product.seoDescription,
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-10">
            <header className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
                <ShoppingBag className="h-3.5 w-3.5" /> Digital Product
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{product.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{product.description}</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{product.price}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <Download className="h-3 w-3" /> {product.format}
                </span>
              </div>
            </header>

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">What&apos;s inside</h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {product.contents.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {product.faqs && product.faqs.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
                <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">FAQ</h2>
                {product.faqs.map((faq) => (
                  <div key={faq.q} className="border-t border-slate-100 dark:border-slate-800 first:border-t-0 pt-5 first:pt-0">
                    <h3 className="font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </section>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <ProductLeadForm productTitle={product.title} productSlug={product.slug} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
