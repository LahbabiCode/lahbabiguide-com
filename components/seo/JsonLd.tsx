import React from "react";

export function JsonLd({ children }: { children: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(children) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    </JsonLd>
  );
}

export function ArticleSchema({ post, url }: { post: any; url: string }) {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "Article",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        headline: post.title,
        description: post.seoDescription,
        image: post.featuredImage ? [post.featuredImage] : undefined,
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
      }}
    </JsonLd>
  );
}

export function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      }}
    </JsonLd>
  );
}

export function SoftwareApplicationSchema({ tool, url }: { tool: any; url: string }) {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        operatingSystem: "Web Browser",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: tool.tags?.[0] || "Developer Tool",
        url: url,
        description: tool.seoDescription || tool.description,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "LahbabiGuide",
          url: "https://lahbabiguide.com",
        },
        featureList: tool.tags || [],
      }}
    </JsonLd>
  );
}

export function ItemListSchema({ items, url }: { items: { name: string; url: string; description?: string }[]; url: string }) {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "ItemList",
        url: url,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: item.url,
          description: item.description,
        })),
      }}
    </JsonLd>
  );
}
