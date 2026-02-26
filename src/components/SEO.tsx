import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.sariaperfume.com";
const DEFAULT_IMAGE = "https://i.ibb.co/dwN5nCSS/Saria-Perfumes-4.jpg";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
}

export default function SEO({
  title,
  description,
  image,
  path,
  type = "website",
}: SEOProps) {
  const { pathname } = useLocation();
  const safePath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : pathname;
  const canonicalUrl = new URL(safePath, SITE_URL).href;

  const metaTitle =
    title ?? "Saria Perfumes | Premium Turkish Fragrances from Istanbul";
  const metaDescription =
    description ??
    "Explore Saria 69, Holigan, Royal Touch, and Black Kiss — four bold Turkish perfume houses crafted in Istanbul for men, women, and unisex patrons.";
  const metaImage = image ?? DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Saria Perfumes" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}
