"use client";

import { useEffect, useState } from "react";

/**
 * Klaviatura yorliqlarini ko'rsatish uchun: faqat Mac'da "⌘" belgisini
 * ko'rsatadi, Windows/Linux'da "Ctrl" yozuvini. O'zi bosiladigan amal
 * har doim `e.metaKey || e.ctrlKey` bilan ishlaydi — bu hook faqat
 * ekranda qaysi yozuv chiqishini hal qiladi.
 *
 * SSR'da navigator yo'q, shuning uchun boshlang'ich holat "Ctrl" (keng
 * tarqalgan standart) va haqiqiy platforma faqat mount bo'lgach aniqlanadi.
 */
export default function usePlatformKey() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent || "";
    setIsMac(/Mac|iPhone|iPad|iPod/.test(platform));
  }, []);

  return { isMac, modKey: isMac ? "⌘" : "Ctrl" };
}
