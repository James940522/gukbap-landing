import { brand } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export function StructuredData({ path = "/", title, description }: {
  path?: string;
  title: string;
  description: string;
}) {
  const websiteId = absoluteUrl("/#website");
  const organizationId = absoluteUrl("/#organization");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": organizationId,
        name: brand.company, legalName: brand.company,
        url: absoluteUrl("/"), logo: absoluteUrl("/images/logos/sanbon-fnb.png"),
      },
      {
        "@type": "WebSite", "@id": websiteId,
        name: brand.name, url: absoluteUrl("/"), inLanguage: "ko-KR",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage", "@id": absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path), name: title, description, inLanguage: "ko-KR",
        isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
      },
    ],
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
