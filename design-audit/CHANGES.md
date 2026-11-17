# NYXELDEV portfolio — Dizayn refresh hisoboti

Branch: `design-refresh` (asosiy `main`'dan). Bu branch **main'ga merge qilinmagan va GitHub'ga push qilinmagan** — bu ataylab qilingan (vazifa shartiga ko'ra).

Hujjat tuzilishi: 1) dizayn yo'nalishi, 2) token jadvali (eski→yangi), 3) fayl bo'yicha o'zgarishlar, 4) i18n matn o'zgarishlari, 5) skrinshotlar, 6) Lighthouse, 7) kontrast skripti, 8) TOP-15 holati, 9) egasi qarori kerak bo'lgan ochiq savollar, 10) commit tarixi.

---

## 1. Dizayn yo'nalishi — qisqacha

Maqsad: saytni "sokin, premium va qasddan qilingan" (Linear/Vercel darajasidagi vazminlik) holatga keltirish, auditda topilgan har bir texnik/a11y muammoni tuzatish — **qo'lda yozilgan CSS + custom properties** saqlanган holda, Tailwind yoki boshqa UI/animatsiya kutubxonalarisiz, va hech qanday mavjud funksiya (3D/SVG SystemDiagram, InvestigationReplay, ⌘K Command Center, 3 tilli i18n, Reveal/SplitText/Counter animatsiyalari, `prefers-reduced-motion`, aloqa formasi) yo'qotilmasdan.

Yondashuv 5 bosqichda olib borildi, har bosqichdan keyin alohida commit:

- **Phase 1 — Fundament:** token darajasida tuzatishlar (rang palitrasi, radius/breakpoint/tipografiya shkalalari, vertikal ritm).
- **Phase 2 — Komponentlar:** bitta tugma tizimi, bitta karta retsepti, 44×44px tegish nishonlari.
- **Phase 3 — Bo'limlar:** har bir bo'limning vizual ierarxiyasi va kompozitsion formulasi.
- **Phase 4 — A11y/texnik qarz:** qolgan takrorlangan CSS qoidalari, `lang` atributi, `aria-label` mos kelmasligi.
- **Phase 5 — Tekshiruv:** lint/test/build/Lighthouse/kontrast/overflow/reduced-motion — barchasi yashil.

---

## 2. Token jadvali — eski → yangi

### 2.1 Rang palitrasi (`src/app/globals.css` `:root`)

| Token | Eski qiymat | Yangi qiymat | Izoh |
|---|---|---|---|
| `--bg` | `#2b2d31` | `#141519` | Chuqurroq grafit, "Discord grey" hissi yo'qoldi |
| `--bg-raise` | `#38393e` | `#1c1d22` | |
| `--bg-sunk` | `#242629` | `#0e0f12` | |
| `--ink` | `#f0f0ec` | `#ededea` | |
| `--ink-2` | `#b4b4ad` | `#b9b9b3` | |
| `--ink-3` | `#8e8e88` (4.19:1, **FAIL**) | `#9d9d97` (6.69:1, **PASS**) | WCAG AA tuzatildi |
| `--ink-4` | `#7d7d78` (3.33:1, **FAIL**) | `#8a8a85` (5.26:1, **PASS**) | WCAG AA tuzatildi, placeholder matnlari ham shu bilan tuzatildi |
| `--on-ink` | `#2b2d31` | `#141519` | |
| `--line` / `--line-2` / `--line-strong` | `#35373c` / `#44454b` / `#6f7076` | `#24252b` / `#2f3037` / `#4a4b53` | |
| `--accent` / `--accent-hi` | `#7ea4ff` / `#a0bdff` | o'zgarmadi | |
| `--on-accent` | `#1b1d20` | o'zgarmadi | |
| `--danger` | `#ff8a8a` | o'zgarmadi | |
| **`--success`** | *(yo'q edi)* | `#4ade80` | **Yangi token** — `#16a34a` (hero__dot, buildlog__dot) va `#4ade80` (cform status) endi bitta tokenga birlashtirildi |
| `--bg-ink` | `#f0f0ec` | **o'chirildi** | Ishlatilmagan o'lik token |
| `--on-ink-2` | `#4a4a46` | **o'chirildi** | Ishlatilmagan o'lik token |
| `--line-ink` | `#e4e4de` | **o'chirildi** | Ishlatilmagan o'lik token |
| `--accent-lo` | `#5f85e0` | **o'chirildi** | Ishlatilmagan o'lik token |
| `--cyan` | `#2ad8ff` | **o'chirildi** | Ishlatilmagan o'lik token |

Barcha matn/fon juftliklari endi dasturiy ravishda tekshirilgan — 7-bo'limga qarang.

### 2.2 Radius shkalasi

| Eski | Yangi |
|---|---|
| `--radius: 4px`, `--radius-lg: 18px`, qolgani (`6px,8px,12px,14px,22px,100px`) qattiq kodlangan | `--radius-sm: 6px`, `--radius: 10px`, `--radius-lg: 18px`, `--radius-pill: 999px` — 4 bosqichli izchil shkala, barcha qattiq kodlangan qiymatlar shu tokenlarga ko'chirildi |

### 2.3 Tipografiya

| Token | Eski | Yangi |
|---|---|---|
| `--t-mono` | `0.6875rem` (≈11px, WCAG kichik matn chegarasidan past) | `0.75rem` (12px) — barcha `.mono`/`.sec-label`/jadval sarlavhalari shu bilan tuzatildi |

`.cs__title` ikki marta e'lon qilingan `font-size` nomuvofiqligi (h3 h1'dan katta bo'lib chiqishi) — tuzatildi, Phase 3.

### 2.4 Breakpointlar

| Eski (12 ta nomlanmagan qiymat) | Yangi (4 ta izchil qiymat) |
|---|---|
| `500, 560, 620, 680, 720, 760, 860, 920, 960, 1040, 1080, 1180` px | `560, 760, 960, 1180` px — har bir komponent shu to'rttasidan biriga ko'chirildi (`contact.css`, `who-i-am.css` dagi `920px` → `960px` kabi) |

### 2.5 Vertikal ritm

DataStory bo'limidagi ikki marta qo'shiluvchi padding+margin xatosi (Work/IELTS'dan va Capabilities'dan keyingi katta bo'sh joylar) tuzatildi — endi har bir bo'lim faqat `--sec-y` orqali bo'shliq oladi.

---

## 3. Fayl bo'yicha o'zgarishlar

### Phase 1 — `src/app/globals.css`
Token blоki to'liq qayta yozildi (yuqoridagi jadvallar); `.sec-label`/`.mono` o'lchami va rangi tuzatildi; DataStory ichidagi mahalliy akcent rangi global tus bilan moslashtirildi, buning sababini tushuntiruvchi izoh qo'shildi (`data-story.css:1-5`).

### Phase 2 — tugma va karta tizimi
- `globals.css`: `.btn--primary`/`.nav__resume`/`.sheet__resume` bitta `.btn--primary` + yangi `.btn--sm` klassiga birlashtirildi; akcent rang endi faqat havola/faol holat/bo'lim raqamlarida, tugma fonida hech qachon ishlatilmaydi (`.btn--primary:hover` endi `color-mix(in srgb, var(--ink) 85%, white 15%)`).
- `.cs`/`.decision-card`/`.capability`/`.experience__entry`/`.mini` — bitta umumiy karta retsepti (`border`+`radius`+`background:var(--bg-raise)`+hover'da max 2px ko'tarilish).
- `footer.css`, `nav.css`: `.foot__top`, `.nav__lang-btn`, `.sheet__lang-btn` — 44×44px tegish nishoniga kattalashtirildi.

### Phase 3 — bo'limlar
- **Nav** (`Nav.jsx`): resume havolasi `.btn.btn--primary.btn--sm` (desktop) / `.sheet__resume.btn.btn--primary` (mobil sheet) ga birlashtirildi.
- **Hero** (`Hero.jsx`, `hero.css`): "SCROLL — 01/SELECTED WORK" qatori (`.hero__floor`) butunlay olib tashlandi; `.hero__viz` (SystemDiagram karta) endi `≤960px`da `display:none` emas, ixcham statik ko'rinishda ko'rsatiladi (3D sahna baribir faqat desktopda yuklanadi, `use3d` shartiga ko'ra — mobilda hech qachon Three.js yuklanmaydi).
- **Work/SEASMP** (`Work.jsx`, `work.css`): ikki marta e'lon qilingan `.cs__title` qoidasi birlashtirildi (h3 endi h2'dan kichik); 3 ta ixcham statistika bloki, kichik ikonali detail kartalar, ko'rinadigan `<details>`.
- **Work/IELTS**: live-demo skrinshoti minimal brauzer-ramka ichiga olindi (3 nuqtali yuqori panel, `.mini__frame`), rasm kesilib/kattalashtirilib o'qilishi osonlashtirildi (`object-position: center 28%; transform: scale(1.15)`).
- **Decisions/Capabilities/Experience/About**: "chap sarlavha, o'ng intro" formulasi takrori kamaytirildi — ikki-tonli sarlavhalar saytda faqat 2 marta qoldirildi (Decisions, WhoIAm); Capabilities endi sarlavha 3-ustunli grid ustida; Experience bitta ustunli timeline'ga aylantirildi (`.experience__entry`dagi ikki ziddiyatli border uslubi — faqat timeline uslubi qoldirildi).
- **WhoIAm**: ikki SplitText span orasidagi `<br/>` olib tashlandi — bu `<br/>` `display:flex;flex-direction:column` ichida o'zining alohida flex-item sifatida to'liq qator balandligida bo'sh joy yaratayotgan edi, 1440px'da "From interfaces" va "to the systems behind them." orasidagi katta bo'shliqning sababi shu edi.
- **Footer/BuildLog** (`BuildLog.jsx`): endi faqat umumiy faollik ko'rsatiladi ("12 public repos · last activity N days ago"), oxirgi muayyan repo nomi/harakat turi endi chiqarilmaydi.
- **Command Center** (`command-center.css`): ikki marta e'lon qilingan `.cmdk__empty` (qarama-qarshi `text-align`) birlashtirildi.

### Phase 4 — a11y va qolgan izchillik muammolari
- `src/hooks/useLanguage.js`: `<html lang>` endi tanlangan til bilan sinxronlanadi, shu jumladan localStorage'dan birinchi yuklanishda ham.
- `Nav.jsx`: `.nav__mark-glyph` ("NX") `aria-hidden="true"` qilindi — ko'rinadigan matn (faqat "NX" yoki "NX"+"NYXELDEV") bilan `aria-label`ning mos kelmasligi (`label-content-name-mismatch`) tuzatildi.
- `nav.css`: `.nav__burger` ikki marta e'lon qilingan qoida (34×34 → 44×44) birlashtirildi.
- `data-story.css`: `.stat`/`.statrow` ikki marta e'lon qilingan qoidalar birlashtirildi.
- `work.css`: `.work__head`, `.cs__head`, `.next`, `.next__label`, `.mini__media` ikki marta e'lon qilingan qoidalar birlashtirildi; ishlatilmaydigan `.cs__badge` qoidasi o'chirildi.
- `system-diagram.css`: har bir `var(--ctrl-*)`/`var(--note-*)` o'qishiga literal fallback qiymat qo'shildi — endi `SystemDiagram` komponenti `.hero__viz`dan tashqarida ishlatilsa ham ranglar aniqlanmagan (`unset`) bo'lib qolmaydi.
- **Yangi:** `design-audit/contrast-check.mjs` — barcha global/DataStory/hero-viz matn/fon juftliklari uchun WCAG kontrast nisbatini hisoblaydigan skript.

### Phase 5 — ishlash (performance)
- `src/app/layout.js`: ikkala shrift (`Inter`, `JetBrains Mono`) `display: "swap"` dan `display: "optional"` ga o'tkazildi — Lighthouse production build'da Hero CTA tugmalarida 0.213 CLS (layout shift) aniqlandi, sababi shrift almashinganda tugma kengligi bir necha piksel o'zgarishi edi; `optional` bilan bu almashinuv butunlay yo'qoladi (CLS = 0).

---

## 4. i18n matn o'zgarishlari (en/ru/uz — uchchalasida ham)

1. **O'chirildi:** `hero.scroll` va `hero.nextSection` kalitlari — Hero'dagi endi yo'q "SCROLL — 01/SELECTED WORK" qatori uchun ishlatilgan edi.
2. **Almashtirildi:** `footer.buildLog.events` (15 ta kalitdan iborat ichki struktura — har bir GitHub voqea turi uchun alohida matn) → bitta `footer.buildLog.lastActivity` satri:
   - en: `"last activity"`
   - ru: `"последняя активность"`
   - uz: `"oxirgi faollik"`

Boshqa hech qanday matnning **ma'nosi** o'zgartirilmadi — faqat struktura/joylashuv (masalan Experience/WhatIBuild sarlavhalaridagi `<br/>` o'rniga bo'sh joy bilan birlashtirish) o'zgardi, so'zlar aynan saqlandi.

---

## 5. Skrinshotlar — BEFORE/AFTER juftliklari

Ikkala to'plam ham real qadam-baqadam skroll bilan olingan (Reveal animatsiyalari ishga tushishi uchun):

| BEFORE (`design-audit/before/`) | AFTER (`design-audit/after/`) |
|---|---|
| `home-375.png` | `home-375.png` |
| `home-768.png` | `home-768.png` |
| `home-1024.png` | `home-1024.png` |
| `home-1440.png` | `home-1440.png` |
| `mobile-menu-375.png` | `mobile-menu-375.png` |
| `cmdk-1440.png` | `cmdk-1440.png` |
| `404-1440.png` | `404-1440.png` |

(Phase 0/1 chegarasida qo'shimcha oraliq skrinshotlar ham bor: `fb48891` commit'da Phase 1 sign-off uchun olingan to'plam.)

---

## 6. Lighthouse — before (dev) / after (prod)

**Before** — audit hujjatida qayd etilgan, `npm run dev` ustida (DESIGN_AUDIT.md 7.2-bo'lim):

| Kategoriya | Ball |
|---|---|
| Performance | 72 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 92 |

**After** — shu sessiyada `npm run build` + statik export (`out/`) ustida, `design-audit/lighthouse-after.json`:

| Kategoriya | Ball |
|---|---|
| Performance | **100** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

Performance'ning 72→100 ga o'sishi asosan: (a) production build (dev-rejimdagi source-map/hot-reload yukini yo'qotish) va (b) yuqorida tasvirlangan `font-display: optional` tuzatishi (CLS 0.213→0) hisobiga.

---

## 7. Kontrast skripti natijasi (`node design-audit/contrast-check.mjs`)

Barcha tekshirilgan juftliklar (global tokenlar + DataStory mikro-temasi + Hero system-diagram kartasi) WCAG AA (≥4.5:1) talabini qondiradi — eng past natija `--on-accent / --accent` = 6.95:1. To'liq jadval skript chiqishida (`node design-audit/contrast-check.mjs` orqali qayta ishga tushirish mumkin).

---

## 8. TOP-15 audit topilmalari — holati

| # | Topilma | Holat |
|---|---|---|
| 1 | `--ink-3`/`--ink-4` WCAG AA'dan past kontrast | ✅ Tuzatildi (Phase 1, yangi palitra) |
| 2 | `.cs__title` ikki marta e'lon, h3 h1'dan katta | ✅ Tuzatildi (Phase 3) |
| 3 | `.experience__entry` ikki ziddiyatli uslub | ✅ Tuzatildi (Phase 3, faqat timeline qoldirildi) |
| 4 | 3 xil "asosiy CTA" tugma uslubi | ✅ Tuzatildi (Phase 2, bitta `.btn--primary` tizimi) |
| 5 | `<html lang>` til almashganda yangilanmaydi | ✅ Tuzatildi (Phase 4) |
| 6 | `.hero__viz` mobilda butunlay yashirin | ✅ Tuzatildi (Phase 3, ixcham statik ko'rinish) |
| 7 | `.cmdk__empty` ikki marta, qarama-qarshi stil | ✅ Tuzatildi (Phase 3) |
| 8 | `--ink-4` forma placeholder kontrasti juda past | ✅ Tuzatildi (Phase 1 palitra yangilanishi bilan birga) |
| 9 | 5 ta ishlatilmaydigan `:root` tokeni | ✅ Tuzatildi (Phase 1, o'chirildi) |
| 10 | SystemDiagram CSS'i Hero'ning mahalliy o'zgaruvchilariga qattiq bog'liq | ✅ Tuzatildi (Phase 4, fallback qiymatlar qo'shildi) |
| 11 | 12 xil nomlanmagan breakpoint | ✅ Tuzatildi (Phase 1, 4 taga tushirildi) |
| 12 | Tegish nishonlari 44×44px'dan kichik | ✅ Tuzatildi (Phase 2) |
| 13 | Ikki xil "muvaffaqiyat yashil"i (`#16a34a`/`#4ade80`) | ✅ Tuzatildi (Phase 1, `--success` tokeni) |
| 14 | `.cs__badge` o'lik CSS | ✅ Tuzatildi (Phase 4, o'chirildi) |
| 15 | DataStory mikro-temasi hujjatlashtirilmagan | ✅ Tuzatildi (Phase 1, tushuntiruvchi izoh qo'shildi) |

**Barcha 15 ta TOP topilma tuzatildi.**

---

## 9. Egasi qarori kerak bo'lgan ochiq savollar

Bu bo'limda vazifa davomida duch kelingan, lekin **mazmunni o'zgartirish yoki taxmin qilishni talab qiladigan** savollar yo'q — barcha tuzatishlar faqat texnik (token, CSS, struktura) darajada, mavjud matn/kontentning ma'nosi o'zgartirilmagan. Shunga qaramay, quyidagilarga e'tibor berish tavsiya etiladi:

1. **IELTS live-demo skrinshoti** — joriy `ielts-1100.webp` rasmi saqlab qolindi (brauzer-ramka ichiga olindi, lekin rasmning o'zi yangilanmadi), chunki yangi "jonli" skrinshot olish uchun tashqi `speakready.netlify.app` saytiga murojaat qilinganda ikkala sahifa holati ham "bo'sh/buzilgan" ko'rinishda chiqdi — "hech qachon kontent to'qib chiqarma" qoidasiga ko'ra, mavjud haqiqiy skrinshot saqlab qolindi. Agar servis holati tiklangan bo'lsa, kelajakda yangi skrinshot olish mumkin.
2. **DataStory bo'limi** — faqat token/bo'shliq darajasida tuzatildi (Phase 1), bo'lim tuzilishi va kontenti o'zgartirilmadi, chunki audit buni "ataylab qilingan kuchli urg'u nuqtasi" deb aniq belgilagan.
3. **Branch holati** — `design-refresh` branch'i hali `main`'ga merge qilinmagan va GitHub'ga push qilinmagan (vazifa shartiga ko'ra). Merge qilishdan oldin branch'ni yana bir bor ko'rib chiqish tavsiya etiladi.

---

## 10. `design-refresh` branch commit tarixi

```
c382122 chore: capture AFTER screenshots for design refresh sign-off
5df94b4 fix(perf): switch font display strategy from swap to optional
ebf33e2 feat(design): Phase 4 — accessibility and remaining consistency debt
a52f4ff feat(design): Phase 3 — section-level restraint and hierarchy fixes
84e076f feat(design): Phase 2 — one button system, one card recipe, 44px tap targets
fb48891 chore: capture AFTER screenshots for Phase 1 sign-off
10db16f feat(design): Phase 1 foundation tokens — deeper graphite palette, radius/breakpoint/type scales
4cbb638 chore: capture BEFORE screenshots for design refresh (Phase 0)
5eabfd7 chore: baseline before design refresh
```

**Tasdiqlangan holat:** `npm run lint` ✅, `npm run build` ✅, Playwright regression suite (10/10) ✅, `node design-audit/contrast-check.mjs` ✅, Lighthouse (prod) 100/100/100/100 ✅, 320–1440px barcha kenglik va uchala tilda gorizontal overflow yo'q ✅, `prefers-reduced-motion: reduce` barcha kontentni ko'rinadigan/statik holatda qoldiradi ✅.
