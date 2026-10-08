import { SITE_URL } from "@/lib/site";

// output:"export" build-vaqtida bitta statik faylga aylantirilishini talab qiladi
export const dynamic = "force-static";

export default function sitemap() {
  // Bitta sahifali sayt — bo'lim lentalarini (anchor) alohida URL sifatida
  // kiritmaymiz, qidiruv tizimlari ularni mustaqil sahifa deb hisoblamaydi.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
