export interface RecommendedLink {
  label: string;
  href: string;
  priority: number;
}

export function getRecommendedLinks(
  pageType: string,
  context?: { slug?: string; tags?: string[]; category?: string }
): RecommendedLink[] {
  const links: RecommendedLink[] = [];

  switch (pageType) {
    case "tool":
      links.push(
        { label: "Best Free Developer Tools", href: "/best/free-developer-tools", priority: 1 },
        { label: "Free Cloud Credits", href: "/best/free-cloud-credits", priority: 2 },
        { label: "All Developer Tools", href: "/tools", priority: 3 },
        { label: "Startup Credits Directory", href: "/credits", priority: 4 },
      );
      break;

    case "credit":
      links.push(
        { label: "Best Free Cloud Credits", href: "/best/free-cloud-credits", priority: 1 },
        { label: "AI Startup Credits", href: "/startup-credits/ai-startups", priority: 2 },
        { label: "Compare Credit Programs", href: "/compare", priority: 3 },
        { label: "Browse All Credits", href: "/credits", priority: 4 },
      );
      break;

    case "directory":
      links.push(
        { label: "Pricing Explained", href: "/pricing", priority: 1 },
        { label: "Best Alternatives", href: "/best/vercel-alternatives", priority: 2 },
        { label: "Platform Comparisons", href: "/compare", priority: 3 },
        { label: "Free Cloud Credits", href: "/best/free-cloud-credits", priority: 4 },
      );
      break;

    case "compare":
      links.push(
        { label: "Platform Pricing", href: "/pricing", priority: 1 },
        { label: "Best Alternatives", href: "/best", priority: 2 },
        { label: "Startup Credits", href: "/credits", priority: 3 },
      );
      break;

    case "blog":
      links.push(
        { label: "Free Developer Tools", href: "/best/free-developer-tools", priority: 1 },
        { label: "Startup Credits", href: "/credits", priority: 2 },
        { label: "Platform Directory", href: "/directory", priority: 3 },
      );
      break;

    case "guide":
      links.push(
        { label: "Developer Tools", href: "/tools", priority: 1 },
        { label: "Startup Credits", href: "/credits", priority: 2 },
        { label: "Platform Directory", href: "/directory", priority: 3 },
      );
      break;

    case "best":
      links.push(
        { label: "Platform Directory", href: "/directory", priority: 1 },
        { label: "Startup Credits", href: "/credits", priority: 2 },
        { label: "Pricing Explained", href: "/pricing", priority: 3 },
        { label: "Comparisons", href: "/compare", priority: 4 },
      );
      break;

    case "pricing":
      links.push(
        { label: "Compare Platforms", href: "/compare", priority: 1 },
        { label: "Best Alternatives", href: "/best", priority: 2 },
        { label: "Free Cloud Credits", href: "/best/free-cloud-credits", priority: 3 },
      );
      break;

    case "alternatives":
      links.push(
        { label: "Pricing Explained", href: "/pricing", priority: 1 },
        { label: "Platform Comparisons", href: "/compare", priority: 2 },
        { label: "Platform Directory", href: "/directory", priority: 3 },
      );
      break;

    case "credit-cluster":
      links.push(
        { label: "All Startup Credits", href: "/credits", priority: 1 },
        { label: "Compare Programs", href: "/compare", priority: 2 },
        { label: "Best Cloud Credits", href: "/best/free-cloud-credits", priority: 3 },
      );
      break;

    default:
      links.push(
        { label: "Developer Tools", href: "/tools", priority: 1 },
        { label: "Startup Credits", href: "/credits", priority: 2 },
        { label: "Platform Directory", href: "/directory", priority: 3 },
      );
  }

  return links.sort((a, b) => a.priority - b.priority);
}
