import { SITE_URL } from "@/lib/site";

// output:"export" build-vaqtida bitta statik faylga aylantirilishini talab qiladi
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
