# NYXELDEV portfolio — DIZAYN AUDITI

**Audit sanasi:** 2026-11-15
**Loyiha:** `C:\Users\Analyst\Documents\Jahongir\personal`
**Audit turi:** READ-ONLY (hech qanday loyiha fayli o'zgartirilmadi — tasdiq hujjat oxirida)
**Server holati:** `npm run dev` (Next.js dev server, port 3000) — audit shu dev server ustida o'tkazildi.

---

## 1. Xulosa (Summary)

NYXELDEV — Next.js 15.5.27 (App Router, static export) asosidagi bitta sahifali ("one-page scroller") portfolio sayt. Dizayn tizimi bitta qo'lda yozilgan CSS token to'plamiga ("Dusk" rang sxemasi) asoslangan — hech qanday UI kutubxonasi (Tailwind, MUI, shadcn va h.k.) ishlatilmagan, 100% qo'lda yozilgan CSS (har bir komponent uchun alohida `.css` fayl). Saytda uchta til bor (ingliz/rus/o'zbek), `useLanguage` React Context orqali ishlaydi, `localStorage`da saqlanadi. Animatsiyalar `IntersectionObserver` asosidagi "reveal-on-scroll" patterniga, `prefers-reduced-motion`ga butunlay hurmat ko'rsatadigan tarzda qurilgan. Vizual jihatdan sayt izchil, professional, "AI lab x Linear x Vercel" estetikasiga mos — lekin kodni chuqur o'rganganda ikkita jiddiy muammo ochiladi: (1) ikkinchi darajali matn ranglari (`--ink-3`, `--ink-4`) asosiy fonda WCAG AA kontrast talabidan pastroq, va bu juda ko'p joyda (deyarli har bir bo'lim yorlig'i, timestamp, ikkinchi darajali matn) ishlatiladi; (2) bir nechta CSS faylda bir xil selektor ikki marta — birinchi safar grid/flex tuzilishi bilan, keyin faylning oxirida qo'shimcha "premium" qatlami bilan — qayta e'lon qilingan, bu holat kodni o'qishni qiyinlashtiradi va kelajakda tasodifiy regressiya xavfini oshiradi. Sayt texnik jihatdan juda puxta: responsive breakpointlarda gorizontal overflow yo'q, console xatolari yo'q (faqat ikkita tashqi GitHub API 403 va WebGL drayver ogohlantirishlari), lorem-ipsum yoki shablon qoldig'i topilmadi, favicon/OG-rasm/meta-description joyida.

---

## 2. Texnologik stek va loyiha tuzilishi

### 2.1 Stek
- **Framework:** Next.js `15.5.27` (App Router), `output: "export"` — to'liq statik export (`next.config.mjs`). `images.unoptimized: true` (chunki statik export `next/image` optimizatsiyasini qo'llab-quvvatlamaydi).
- **React:** `^19.0.0` / `react-dom ^19.0.0`.
- **3D:** `@react-three/fiber ^9.8.2` + `three ^0.180.0` — faqat Hero bo'limidagi `SystemDiagram` komponentining ixtiyoriy 3D ("hologram") rejimi uchun (`SystemDiagramScene.jsx`), faqat WebGL mavjud desktopda (`min-width:961px`) ishga tushadi, aks holda statik SVG ko'rsatiladi.
- **Ikonkalar:** `lucide-react ^0.501.0` (SVG ikon kutubxonasi).
- **Stil yondashuvi:** Hech qanday CSS-in-JS yoki utility-framework YO'Q. Har bir komponent papkasida alohida oddiy `.css` fayl (masalan `nav.css`, `hero.css`), global token va reset — `src/app/globals.css`. CSS Custom Properties (`:root` o'zgaruvchilari) — yagona token manbasi.
- **Animatsiya:** Tashqi kutubxonasiz — qo'lda yozilgan `IntersectionObserver` hook (`useInView.js`) + CSS `transition`/`@keyframes`. Barcha harakatlar `@media (prefers-reduced-motion: reduce)` bilan o'chiriladi.
- **Shrift yuklash:** `next/font/google` — `Inter` (variable, `subsets:["latin"]`, `display:"swap"`, og'irlik cheklanmagan → variable font sifatida yuklanadi) va `JetBrains_Mono` (`weight:["400","500"]`, `display:"swap"`). CSS o'zgaruvchilari: `--font-sans`, `--font-mono` ([layout.js:6-17](src/app/layout.js:6)).
- **i18n:** Maxsus kutubxonasiz, qo'lda yozilgan `React Context` (`src/hooks/useLanguage.js`) + uchta lug'at fayli (`src/lib/i18n/{en,ru,uz}.js`), `localStorage` orqali saqlanadi, standart til — `en`.
- **Test:** Python + Playwright (`tests/portfolio_regression.py`, 10 ta test, `npm test` orqali ishga tushadi).

### 2.2 Papka daraxti (node_modules/.git/.next/out chiqarib tashlangan)

```
.claude/launch.json, settings.local.json
.github/workflows/checks.yml
README.md
artifacts/                      (oldingi auditlar/skrinshotlardan qolgan papka — 40+ PNG/JSON fayl)
docs/
  implementation-verification.md
  premium-refinement.md
eslint.config.mjs
jsconfig.json
next.config.mjs
package.json, package-lock.json
postcss.config.mjs
public/
  files/Resume.pdf
  images/favicon.ico, ielts-1100.webp, ielts-640.webp, og.png
resume/Resume.html
scripts/render_resume.py
src/
  app/
    globals.css, layout.js, not-found.css, not-found.js, page.js, robots.js, sitemap.js
  components/
    CommandCenter/CommandCenter.jsx, command-center.css
    Contact/Contact.jsx, contact.css
    DataStory/DataStory.jsx, InvestigationReplay.jsx, data-story.css
    Decisions/Decisions.jsx, decisions.css
    Experience/Experience.jsx, experience.css
    Footer/BuildLog.jsx, Footer.jsx, footer.css
    Hero/Hero.jsx, hero.css
    Nav/Nav.jsx, nav.css
    NotFound/NotFoundBody.jsx
    SystemDiagram/SystemDiagram.jsx, SystemDiagramScene.jsx, TraceLine.jsx, system-diagram.css
    WhatIBuild/WhatIBuild.jsx, what-i-build.css
    WhoIAm/WhoIAm.jsx, who-i-am.css
    Work/Work.jsx, work.css
    ui/
      Counter.jsx, Magnetic.jsx, Parallax.jsx, Reveal.jsx, ScrollProgress.jsx, SplitText.jsx, useInView.js
  hooks/
    useLanguage.js, usePlatformKey.js
  lib/
    dialogFocus.js, projects.js, site.js
    i18n/en.js, ru.js, uz.js
tests/
  portfolio_regression.py, requirements.txt
```

### 2.3 Sahifalar/marshrutlar

| Marshrut | Fayl | Izoh |
|---|---|---|
| `/` | [src/app/page.js](src/app/page.js) | Yagona asosiy sahifa — barcha bo'limlar shu yerda tartib bilan render qilinadi |
| `/robots.txt` | [src/app/robots.js](src/app/robots.js) | `force-static`, `SITE_URL` dan sitemap havolasi |
| `/sitemap.xml` | [src/app/sitemap.js](src/app/sitemap.js) | O'qilmadi (fayl mavjud, lekin audit doirasida batafsil ko'rilmadi) — NOT FOUND: tarkibi tekshirilmagan |
| `/* (404)` | [src/app/not-found.js](src/app/not-found.js) + [src/components/NotFound/NotFoundBody.jsx](src/components/NotFound/NotFoundBody.jsx) | Server komponent (`metadata` export) + mijoz komponenti (`useLanguage` uchun) ikkiga bo'lingan |

Bitta sahifa ichidagi bo'limlar tartibi (DOM tartibi, [src/app/page.js:21-33](src/app/page.js:21)):
`Nav → Hero → Work → DataStory → Decisions → WhatIBuild → Experience → WhoIAm → Contact → Footer → CommandCenter (dialog, DOM oxirida)`.

**Diqqat:** bo'lim raqamlari (`sec-label__num`) DOM tartibidan farq qiladi — Work="01", DataStory="02", Decisions="03", WhatIBuild="04", Experience="05", WhoIAm="06", Contact="07". Bu ataylab shunday (raqamlash mantiqiy voqea tartibini aks ettiradi), lekin kod o'quvchisi uchun eslatma kerak.

### 2.4 Qayta ishlatiluvchi komponentlar

| Komponent | Fayl | Tavsif |
|---|---|---|
| Nav | [Nav.jsx](src/components/Nav/Nav.jsx) | Suzuvchi "pill" navbar: logotip, havolalar, ⌘K tugmasi, til almashtirgich, rezyume CTA, mobil burger + sheet dialog |
| Hero | [Hero.jsx](src/components/Hero/Hero.jsx) | Birinchi ekran: sarlavha, qisqa tavsif, CTA tugmalar, 3D/SVG arxitektura vizуали |
| SystemDiagram | [SystemDiagram.jsx](src/components/SystemDiagram/SystemDiagram.jsx) | Hero ichidagi interaktiv arxitektura sxemasi (SVG fallback + ixtiyoriy 3D) |
| SystemDiagramScene | [SystemDiagramScene.jsx](src/components/SystemDiagram/SystemDiagramScene.jsx) | `@react-three/fiber` bilan qurilgan 3D "hologram" sahna (faqat katta ekran + WebGL) |
| TraceLine | [TraceLine.jsx](src/components/SystemDiagram/TraceLine.jsx) | Faol tugun uchun "typewriter" log effekti |
| Work | [Work.jsx](src/components/Work/Work.jsx) | SEASMP case-study + IELTS mini-case |
| DataStory | [DataStory.jsx](src/components/DataStory/DataStory.jsx) | "Qora tasma" bo'lim — logistika tergovi, statistik raqamlar |
| InvestigationReplay | [InvestigationReplay.jsx](src/components/DataStory/InvestigationReplay.jsx) | 3 bosqichli animatsion "replay" (ledger/join/sana vizуаllari) |
| Decisions | [Decisions.jsx](src/components/Decisions/Decisions.jsx) | 4 ta muhandislik qarori kartochkalari |
| WhatIBuild | [WhatIBuild.jsx](src/components/WhatIBuild/WhatIBuild.jsx) | 3 guruhli ko'nikmalar ro'yxati |
| Experience | [Experience.jsx](src/components/Experience/Experience.jsx) | Bitta ish tajribasi yozuvi |
| WhoIAm | [WhoIAm.jsx](src/components/WhoIAm/WhoIAm.jsx) | "Men haqimda" + faktlar ustuni |
| Contact | [Contact.jsx](src/components/Contact/Contact.jsx) | Forma (FormSubmit.co orqali) + aloqa kanallari |
| Footer | [Footer.jsx](src/components/Footer/Footer.jsx) | Pastki qism + BuildLog |
| BuildLog | [BuildLog.jsx](src/components/Footer/BuildLog.jsx) | GitHub API orqali jonli faoliyat widgeti |
| CommandCenter | [CommandCenter.jsx](src/components/CommandCenter/CommandCenter.jsx) | ⌘K qidiruv/buyruqlar dialogi |
| NotFoundBody | [NotFoundBody.jsx](src/components/NotFound/NotFoundBody.jsx) | 404 sahifa tanasi (mijoz komponenti) |
| Reveal | [Reveal.jsx](src/components/ui/Reveal.jsx) | Scroll-trigger "fade+slide" o'ramchi |
| useInView | [useInView.js](src/components/ui/useInView.js) | `IntersectionObserver` hook — Reveal/Counter/SplitText asosi |
| SplitText | [SplitText.jsx](src/components/ui/SplitText.jsx) | So'z-so'z paydo bo'lish animatsiyasi |
| Counter | [Counter.jsx](src/components/ui/Counter.jsx) | 0 dan maqsad raqamgacha sanash animatsiyasi |
| Magnetic | [Magnetic.jsx](src/components/ui/Magnetic.jsx) | Sichqoncha yaqinlashganda elementni tortish effekti |
| Parallax | [Parallax.jsx](src/components/ui/Parallax.jsx) | Scroll parallaks effekti (IELTS rasmida ishlatiladi) |
| ScrollProgress | [ScrollProgress.jsx](src/components/ui/ScrollProgress.jsx) | Yuqoridagi ingichka "o'qish progressi" chizig'i |

### 2.5 Lokal ishga tushirish

`package.json` skriptlari:
```
npm run dev     → next dev        (port 3000)
npm run build   → next build      (statik export, "out/" papkaga)
npm run lint    → eslint src next.config.mjs eslint.config.mjs
npm test        → python tests/portfolio_regression.py
npm run resume  → python scripts/render_resume.py
```
Audit vaqtida dev server allaqachon ishlab turgan edi (`http://localhost:3000`, HTTP 200). Sahifa **xatosiz** yuklandi; brauzer konsolida faqat: React DevTools taklifi (info), WebGL drayver "GPU stall due to ReadPixels" ogohlantirishlari (3D sahna uchun normal, funksional xato emas), va ikkita `403` tarmoq xatosi (quyida 11-bo'limda).

---

## 3. Dizayn tokenlari

### 3.1 Ranglar — `:root` ([globals.css:7-71](src/app/globals.css:7))

| Token | Qiymat | Guruh | Qo'llanilishi |
|---|---|---|---|
| `--bg` | `#2b2d31` | Fon (asosiy) | `body`, sahifa asosiy foni |
| `--bg-raise` | `#38393e` | Fon (ko'tarilgan sirt) | Kartochkalar (`.cs`, `.cform`, `.stackmap__cell`), input fonlari, nav "stuck" holati |
| `--bg-sunk` | `#242629` | Fon (botgan sirt) | Scrollbar track, `.stackmap`, `.mini__media`, `.cmdk__item.is-on` |
| `--bg-ink` | `#f0f0ec` | **Ishlatilmaydi** | Kodda qidiruv natijasi: hech bir `.css` faylda ishlatilmagan — o'lik token (`--ink` bilan bir xil qiymat, ehtimol dublikat/eskirgan) |
| `--ink` | `#f0f0ec` | Matn (asosiy) | Sarlavhalar, asosiy matn |
| `--ink-2` | `#b4b4ad` | Matn (ikkinchi daraja) | `.lead`, kartochka tanasi |
| `--ink-3` | `#8e8e88` | Matn (uchinchi daraja) | `.mono`, `.sec-label`, ko'p joy — **kontrast muammosi, 8-bo'limga qarang** |
| `--ink-4` | `#7d7d78` | Matn (to'rtinchi daraja) | Metama'lumot, placeholder — **kontrast muammosi** |
| `--on-ink` | `#2b2d31` | Akcent fon ustidagi matn | `.btn--primary` matni |
| `--on-ink-2` | `#4a4a46` | **Ishlatilmaydi** | Kodda qidiruv: hech qayerda ishlatilmagan — o'lik token |
| `--line` | `#35373c` | Chiziq (zaif) | Bo'lim ajratgichlari, kartochka chegaralari |
| `--line-2` | `#44454b` | Chiziq (o'rta) | Tugma/input chegaralari |
| `--line-strong` | `#6f7076` | Chiziq (kuchli) | Scrollbar thumb, input chegarasi |
| `--line-ink` | `#e4e4de` | **Ishlatilmaydi** | O'lik token |
| `--accent` | `#7ea4ff` | Akcent (asosiy) | Havolalar hover, faol holatlar, scrollbar hover |
| `--accent-hi` | `#a0bdff` | Akcent (och) | Gradient boshlanishi (`.nav__resume`) |
| `--accent-lo` | `#5f85e0` | Akcent (to'q) | **Ishlatilmaydi** — kodda hech qayerda topilmadi, o'lik token |
| `--cyan` | `#2ad8ff` | Qo'shimcha akcent | **Ishlatilmaydi** — o'lik token |
| `--accent-wash` | `rgba(126,164,255,.12)` | Akcent (shaffof fon) | Hover fonlari, glow effektlar |
| `--accent-line` | `rgba(126,164,255,.3)` | Akcent (shaffof chegara) | Faol holat chegaralari |
| `--on-accent` | `#1b1d20` | Akcent fon ustidagi matn | `.btn--primary:hover`, `.nav__resume` |
| `--danger` | `#ff8a8a` | Semantik (xato) | Forma xato matni/chegarasi |

**Qattiq kodlangan (token orqali emas) ranglar — fayl bo'yicha:**

| Rang | Fayl:qator | Nima uchun | Izoh |
|---|---|---|---|
| `#16a34a` | [hero.css:32](src/components/Hero/hero.css:32) `.hero__dot` | "Ishga ochiq" indikatori (yashil nuqta) | |
| `#16a34a` | [footer.css:43](src/components/Footer/footer.css:43) `.buildlog__dot` | GitHub faollik indikatori | Ikki faylda bir xil qiymat qayta yozilgan — token bo'lishi kerak edi |
| `#4ade80` | [contact.css:108](src/components/Contact/contact.css:108) `.cform__status.is-ok` | Forma muvaffaqiyat matni | **Yuqoridagi `#16a34a` ga yaqin, lekin bir xil emas** — ikkita turli "muvaffaqiyat yashil"i, near-duplicate |
| `#09090b` / `#f4f4f1` | [data-story.css:3-4](src/components/DataStory/data-story.css:3) `.datastory` | DataStory bo'limi uchun MAXSUS qora-tasma fon + mahalliy qayta aniqlangan `--ink*`/`--line*`/`--accent*` o'zgaruvchilari | Bu ataylab qilingan "eng kuchli nuqta" effekti (bo'limning o'zi ichida token'larni qayta e'lon qiladi) — yagona Dusk sxemaga zid emas (tugma/toggle yo'q), lekin alohida "mahalliy mikro-tema" sifatida hujjatlashtirilishi kerak edi |
| `#0c0c10` | [data-story.css:57,180](src/components/DataStory/data-story.css:57) `.joinviz`, `.replay__stage` | Diagramma konteyner foni | |
| `#121217` | [data-story.css:99](src/components/DataStory/data-story.css:99) `.joinviz__nodes rect` | SVG tugun foni | |
| `#4a3030`, `#6b4242`, `#8a4b4b` | [data-story.css:78,132,147,298,303](src/components/DataStory/data-story.css:78) | "Buzilgan bog'lanish" qizil tus gradatsiyasi | |
| `#ff8f8f` | data-story.css (7 ta joyda: 136,157,164,304,358,428) | Xato/"fault" matn rangi | **`--danger: #ff8a8a` ga juda yaqin, lekin bir xil emas** — near-duplicate, tokenlashtirilmagan |
| `#86adff`, `#becbe1`, `#91a0b8`, `#344563`, `#385581`, `#142139`, `#6b84ab`, `#a2b2cc`, `#30415f`, `#9ebae8`, `#bac7dc`, `#a6b5ce`, `#f0f5ff`, `#1b2b46`, `#456798`, `#d7e5ff`, `#1b2e4d`, `#314361`, `#182c4a`, `#0c1525` | [hero.css:45-55](src/components/Hero/hero.css:45) `.hero__viz` | Hero ichidagi "quyuq ko'k konsol karta" uchun to'liq mahalliy mikro-tema (20 ta qo'shimcha o'zgaruvchi) | SystemDiagram.jsx'ning CSS fayli (`system-diagram.css`) ba'zi stillari (`.sysdia__controls`, `.sysdia__note`, `.sysdia__trace*`) aynan shu yerda e'lon qilingan `--ctrl-*`/`--note-*` o'zgaruvchilarga tayanadi — ya'ni **SystemDiagram komponenti Hero'dan tashqarida ishlatilsa, bu o'zgaruvchilar aniqlanmagan bo'lib qoladi** (CSS fallback yo'q) |
| `rgba(255,255,255,.07)` / `rgba(255,255,255,.025)` | [data-story.css:504,621](src/components/DataStory/data-story.css:504) | Shaffof oq overlay fonlar | |

### 3.2 Tipografiya

**Shriftlar:** `Inter` (`--font-sans`, `next/font/google`, variable, `display:swap`) va `JetBrains Mono` (`--font-mono`, og'irliklar faqat `400`/`500`, `display:swap`). Fallback zanjiri: `var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` va `var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace` ([globals.css:41-43](src/app/globals.css:41)).

**Fluid tipografik shkala** ([globals.css:46-54](src/app/globals.css:46)):

| Token | `clamp()` qiymati | ~Mobil (375px) | ~Desktop (1440px) |
|---|---|---|---|
| `--t-display` | `clamp(2.75rem, 1.2rem+6.4vw, 7rem)` | ~44px | 112px (cap) |
| `--t-h1` | `clamp(2.25rem, 1.2rem+4.2vw, 4.5rem)` | ~36px | 72px (cap) |
| `--t-h2` | `clamp(1.75rem, 1.1rem+2.6vw, 3rem)` | ~28px | 48px (cap) |
| `--t-h3` | `clamp(1.25rem, 1rem+1.1vw, 1.75rem)` | ~20px | 28px (cap) |
| `--t-lead` | `clamp(1.0625rem, .98rem+.5vw, 1.375rem)` | ~17px | 22px (cap) |
| `--t-body` | `1rem` (fiksirlangan) | 16px | 16px |
| `--t-sm` | `0.875rem` | 14px | 14px |
| `--t-xs` | `0.75rem` | 12px | 12px |
| `--t-mono` | `0.6875rem` | 11px | 11px |

**Element → stil jadvali** (koddan tasdiqlangan real qiymatlar):

| Element | Shrift | Hajm (token) | Og'irlik | Line-height | Letter-spacing | Rang |
|---|---|---|---|---|---|---|
| `h1` (Hero `.hero__name`) | sans | `--t-display` | 500 | `.94` (mahalliy) | `-.065em` (mahalliy, global `h1-h4` qoidasini bekor qiladi) | `--ink` / `--ink-3` (ikkinchi so'z) |
| `h2` (bo'lim sarlavhalari, mas. `.work__head`, `.decisions__head`) | sans | `--t-h1`\* | 500 (global) | `1.04` (global) | `-.03em` (global) yoki `-.042em`/`-.045em` (mahalliy override) | `--ink` |
| `h3` (`.cs__title`, `.decision-card h3`, `.fault__title`) | sans | `--t-h2`/`--t-h3` (nomuvofiq, pastga qarang) | 500 | `1.04`/`1.2`/`1.3` (nomuvofiq) | turlicha | `--ink` |
| `h4` (`.cs__detail h4`) | sans | `1.15rem` (qattiq kodlangan, token emas) | 500 | `1.3` (mahalliy) | global `-.03em` | `--ink` |
| `p` (`.lead`) | sans | `--t-lead` | 400 | `1.5` | `-.015em` | `--ink-2` |
| `p` (oddiy matn) | sans | `--t-body`/`--t-sm` (kontekstga qarab) | 400 | `1.6` (global `body`) yoki `1.65`-`1.7` (mahalliy) | — | `--ink-2` |
| `button`/`.btn` | sans | `--t-sm` | 500 | — | `-.01em` | kontekstga qarab |
| nav link (`.nav__link`) | sans | `--t-sm` | 400 (meros) | — | — | `--ink-3` → hover `--ink` |
| label (`.field__label`) | mono | `--t-mono` (meros `.mono` dan) | 400 | — | `.14em` | `--ink-4` |
| `.mono`/`.sec-label` | mono | `--t-mono` (11px) | 400 | — | `.14em`/`.18em` | `--ink-3` |

\* **Nomuvofiqlik:** `h2` darajasidagi sarlavhalar aslida `--t-h1` tokenidan foydalanadi (`.work__head`, `.datastory__head`, `.decisions__head`, `.build__head`, `.who__head`, `.contact__head` — barchasi [work.css:2](src/components/Work/work.css:2), [data-story.css:33](src/components/DataStory/data-story.css:33), [decisions.css:9](src/components/Decisions/decisions.css:9) va h.k.da `font-size: var(--t-h1)`), real `<h2>` elementi bo'lsa ham. Bu semantik jihatdan to'g'ri (h1 — Hero, bitta sahifada), lekin token nomlanishi chalkash: "`--t-h1`" nomli token aslida har bir bo'lim h2'si uchun ishlatiladi, haqiqiy `<h1>` esa alohida `--t-display` tokenidan foydalanadi.

**Qo'shimcha nomuvofiqlik:** `.cs__title` (Work ichidagi h3, "SEASMP") ikki marta e'lon qilingan: avval `font-size: var(--t-h2)` ([work.css:37](src/components/Work/work.css:37)), keyin fayl oxirida `font-size: clamp(2.5rem, 5vw, 4.5rem)` ga **qayta yozilgan** ([work.css:379](src/components/Work/work.css:379)) — ikkinchisi g'alaba qiladi, ya'ni h3 darajasidagi "SEASMP" matni aslida h1'dan ham katta (40-72px) bo'lib chiqadi. Bu — eng katta tipografik og'ish nuqtasi (13-bo'limda Top-15'ga kiritilgan).

`font-weight: 450` — [who-i-am.css:22](src/components/WhoIAm/who-i-am.css:22) `.who__lead` uchun ishlatilgan, standart 100-qadamli og'irlik shkalasiga (400/500) mos kelmaydi; Inter variable font sifatida yuklangani uchun texnik jihatdan ishlaydi, lekin loyihaning qolgan qismida faqat 400/500 ishlatiladi — yagona istisno.

### 3.3 Bo'shliqlar (Spacing)

**Asosiy shkala:** `clamp()` ga asoslangan fluid qiymatlar, qattiq rem qadamlar emas. Eng ko'p takrorlanadigan diskret qiymatlar: `0.4rem, 0.5rem, 0.65rem, 0.75rem, 0.85rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem`.

**Bo'lim vertikal bo'shlig'i:** `--sec-y: clamp(3.5rem, 2rem+5vw, 6.5rem)` — barcha `.section` klassiga ega elementlarga bir xil qo'llaniladi ([globals.css:191](src/app/globals.css:191)). DataStory o'zining tashqi margin'ini alohida belgilaydi: `margin-block: clamp(3rem, 7vw, 6rem)` ([data-story.css:5](src/components/DataStory/data-story.css:5)) — `.section`dan farqli nom/qiymat, chunki DataStory `<section className="section datastory">` emas, faqat `className="section datastory"`dagi holatini tekshirish kerak — DataStory.jsx `<section className="section datastory" id="data">` ishlatadi, demak HAM `--sec-y` (padding-block) HAM o'zining `margin-block` qiymati qo'llaniladi — ya'ni DataStory boshqa bo'limlarga nisbatan qo'shimcha tashqi bo'shliqqa ega.

**Konteyner:** `--max: 1320px` (`.shell` max-width), `--gut: clamp(1.25rem, .6rem+2.6vw, 3.5rem)` (`.shell` gorizontal padding, ~20px mobil → 56px desktop).

**Noregulyar qiymatlar:** `.cs__detail h4 { font-size: 1.15rem }`, `.capability h3 { font-size: 1.15rem }` — token emas, qattiq kodlangan, lekin ikkalasi bir xil qiymatda mos keladi.

### 3.4 Radius / Shadow / Border / Opacity / Z-index

| Token/qiymat | Qayerda |
|---|---|
| `--radius: 4px` | Kichik elementlar (`.chip` emas — chip 100px, balki `.find`, `.cs__detail` kabi) |
| `--radius-lg: 18px` | Katta kartalar (`.cs`, `.mini`, `.decision-card`, `.cmdk__panel`) |
| `100px` (qattiq kodlangan, pill) | Tugmalar, nav, chip, sheet__resume — token emas, lekin izchil ishlatilgan |
| `6px`, `8px`, `12px`, `14px`, `22px` | Turli joylarda qattiq kodlangan radius qiymatlari (`.replay__dot`=6px, `.channel__icon`=8px, `.capability__icon`=12px, `.sysdia__canvas-wrap`=14px, `.hero__viz`=22px) — yagona shkalaga tushmaydi |
| Shadow 1 | `0 16px 60px -40px rgba(0,0,0,.22)` — `.cs` ([work.css:377](src/components/Work/work.css:377)) |
| Shadow 2 | `0 20px 40px -24px rgba(0,0,0,.25)` — `.mini__media` |
| Shadow 3 | `0 24px 60px -48px rgba(0,0,0,.25)` — `.cform` |
| Shadow 4 | `0 30px 80px -40px rgba(14,37,75,.6)` — `.hero__viz` |
| Shadow 5 | `0 24px 60px -12px rgba(0,0,0,.7)` — `.cmdk__panel` |
| Shadow 6 (hover) | `0 16px 40px -24px var(--accent-line)` — `.decision-card:hover` |
| Shadow 7 (hover) | `0 24px 70px -36px var(--accent-line)` — `.cs:hover` | 
| Opacity | `.55` (grid-bg), `.6`/`.9` (SVG oqim chiziqlari), `.13` (hero__viz dot), `.025`/`.07` (overlay fon) — barchasi qattiq kodlangan, birlashtirilgan shkala yo'q |
| Z-index | `100` (`.nav`), `101` (`.progress`), `150` (`.sheet`), `200` (`.skip`) — tartiblangan, to'qnashuv yo'q |

### 3.5 Breakpointlar

Haqiqiy loyihada **aniq nomli breakpoint token yo'q** — har bir fayl o'zining `@media (max-width: Npx)` qiymatlarini mustaqil belgilaydi. Topilgan barcha qiymatlar (kichikdan kattaga): **500px** (balandlik, `max-height`), **560px**, **620px**, **680px**, **720px**, **760px**, **860px**, **920px**, **960px**, **1040px**, **1080px**, **1180px**. Bu 12 xil qiymat — izchil "sm/md/lg" tizimi yo'q, har bir komponent o'z ehtiyojiga qarab breakpoint tanlagan. Funksional jihatdan muammo yaratmaydi (chunki test natijalarida gorizontal overflow topilmadi — 7-bo'limga qarang), lekin kelajakda yangi komponent qo'shilganda izchillikni saqlash qiyinlashadi.

### 3.6 Tungi/kunduzgi rejim

**Tasdiqlanadi:** loyihada tungi/kunduzgi almashtirgich **ataylab yo'q**. `git log`dagi commit tarixi ("Remove mode-gating; ship what I'd actually call ideal") buni tasdiqlaydi — avval ikki rejim bo'lgan, keyin ataylab bitta "Dusk" sxemasiga birlashtirilgan. `useTheme.js` fayli o'chirilgan (`git status`da `D src/hooks/useTheme.js` sifatida ko'rinadi). Bu YETISHMAYOTGAN funksiya emas, balki ataylab qilingan dizayn qarori.

---

## 4. Sahifa/bo'lim bo'yicha tahlil

> Matn namunalari standart (`en`) lug'atdan olingan — sayt endi uch tilli (`src/lib/i18n/{en,ru,uz}.js`, `useLanguage` context orqali, standart til — ingliz). Quyida har bir matn ingliz tilidagi asl nusxasi bilan keltiriladi.

### 4.1 Nav — [Nav.jsx](src/components/Nav/Nav.jsx) / [nav.css](src/components/Nav/nav.css)
- **Joylashuv:** `position:fixed`, butun ekran kengligida suzuvchi, ichidagi `.nav__inner` — balandligi **60px**, max-width `--max` (1320px), `border-radius:100px` (pill).
- **Fon:** boshlang'ich holatda shaffof (`background:transparent`); scroll qilinganda (`.is-stuck`) — `color-mix(in srgb, var(--bg-raise) 78%, transparent)` + `backdrop-filter: saturate(180%) blur(18px)`.
- **Tarkib:** logotip (`NX` glif + `NYXELDEV` matn) · 7 ta bo'lim havolasi (desktopda, `≤1180px`da yashiriladi) · ⌘K tugmasi (`≤1180px`da yashiriladi) · EN/RU/UZ til almashtirgich (`≤720px`da yashiriladi) · "View résumé" gradient CTA (`≤560px`da yashiriladi) · mobil burger (`>1180px`da yashirin).
- **Mobil sheet:** `<dialog>` elementi, o'ngdan to'liq balandlikka yoyiladi (`width:min(480px,100%)`, `height:100dvh`), ichida 7 ta katta havola (raqamlangan `01`-`07`), rezyume tugmasi, email havolasi, til almashtirgich (EN/RU/UZ pill tugmalari).
- **Interaktiv holatlar:** hover/focus/active mavjud (`.nav__link:hover`, `.nav__resume:hover/:active`); `is-active` (joriy bo'lim) — `IntersectionObserver` orqali avtomatik.
- **Animatsiya:** fon/chegara/shadow o'tishi `0.4s` (`--d-mid`), `cubic-bezier(.65,0,.35,1)`.
- **375/768/1024/1440px holati:** 375-768px — faqat logotip glifi + burger (matn va resume yashirin); 1024-1180px — hali ham burger rejimi (chunki breakpoint 1180px); 1440px — to'liq nav (havolalar, ⌘K, til, resume hammasi ko'rinadi).

### 4.2 Hero — [Hero.jsx](src/components/Hero/Hero.jsx) / [hero.css](src/components/Hero/hero.css)
- **Layout:** `grid-template-columns: minmax(0,1.1fr) minmax(0,.9fr)` (`≤960px`da 1 ustun, vizual qism butunlay yashiriladi `display:none`).
- **Fon:** `.hero::before` — `radial-gradient(ellipse, var(--accent-wash), transparent 60%)`, `18s ease-in-out infinite alternate` sekin suzuvchi animatsiya (`hero-drift` keyframe, `-4%,6%` siljish + `1.08` scale); `prefers-reduced-motion:reduce`da to'xtaydi.
- **Matn (en):** eyebrow — "Available for work" / "Tashkent, UZ"; H1 — "NYXEL"/"DEV" (SplitText bilan, `aria-label="NYXELDEV"`); rol — "Full-stack developer."; lead — "I built role-based dashboards for an education platform, and traced why a payroll join dropped 47% of the payout in a logistics sample."; CTA — "View selected work" / "View résumé"; pastki qator — "Email me" / "GitHub ↗" / "Tashkent · Open to remote work".
- **O'ng tomondagi "konsol karta" (`.hero__viz`):** mustaqil mahalliy rang sxemasi (3.1-bo'limga qarang), ichida `SystemDiagram` komponenti (SVG yoki 3D).
- **Tugmalar:** `.btn--primary` (to'q fon, hover'da akcent), `.btn--ghost` (chegarali, hover'da ko'tarilgan fon) — ikkalasida ham `Magnetic` wrapper (sichqoncha tortish effekti).
- **Pastki "proof" qatori:** 3 ta havola (01/02/03 — Full-stack architecture / Real-world data investigation / The reasoning behind the code), `≤560px`da ustunga aylanadi, har biri pastki chegara bilan ajratiladi.
- **Interaktiv holatlar:** `.btn:hover` (translateY -2px), `:active` (scale .97) — global qoida; `.hero__proof a:hover svg` strelka siljiydi; reduced-motion'da `.btn:hover{transform:none}`.

### 4.3 Work (SEASMP + IELTS) — [Work.jsx](src/components/Work/Work.jsx) / [work.css](src/components/Work/work.css)
- **Sarlavha:** "Systems, with the details." (`h2`, lekin `font-size` ikki marta bekor qilingan — 3.2-bo'limga qarang).
- **SEASMP case-study karta (`.cs`):** `border-radius:18px`, fon `--bg-raise`, ichida: header (kicker/title/subtitle/meta + "Source ↗" havolasi) → 3 ustunli highlight grid → 2 ustunli "Problem/My contribution" → stackmap (4 qator: Client/Core/Analytics/Data) → 4 ta detail karta (Architecture/Attendance/Data & ML/Security, 2x2 grid) → "Testing & delivery" izohi → `<details>` ("Limits & next steps", 4 ta bullet).
- **IELTS mini-case (`.mini`):** 2 ustunli (rasm + matn), rasm — `/images/ielts-1100.webp` (1100x688, `webp` + responsive `srcSet` 640w/1100w), `alt="IELTS Speaking Practice live landing page with Part 1, Part 2 and Part 3 choices"`. Chip ro'yxati: Next.js/React/Ant Design/REST API.
- **Animatsiya:** `.mini__media:hover img { filter: saturate(1.08) contrast(1.02) }`; `Parallax` wrapper rasmga sekin siljish qo'shadi.
- **680/860px'da:** `.cs__head` ustunga aylanadi, `.stackmap__row`/`.cs__highlights`/`.cs__overview`/`.cs__details` 1 ustunga tushadi.
- **920px'da:** `.mini` 1 ustunga tushadi.

### 4.4 DataStory + InvestigationReplay — [DataStory.jsx](src/components/DataStory/DataStory.jsx), [InvestigationReplay.jsx](src/components/DataStory/InvestigationReplay.jsx)
- **Fon:** butun bo'lim `#09090b` (deyarli qora), mustaqil rang tokenlari (3.1-bo'lim).
- **Sarlavha:** "The totals did not match." / "I traced the records." (ikki qatorli, ikkinchisi akcent rangda).
- **InvestigationReplay** — 3 bosqichli avtomatik aylanuvchi (`STEP_MS=3600ms`) demonstratsiya: (1) Ledger vizuali — jadval qatorlari + "Naive sum" xatosi; (2) Join vizuali — SVG diagramma (TOUR/LOAD/JOIN/PAYOUT tugunlari, animatsion oqim chiziqlari, "−47%" yo'qotish belgisi) + misol jadval; (3) Sana vizuali — ikki progress-bar (Jun 1-15 / Jun 9-23 oraliqlari). Pastda 3 ta "fault" kartochka (joriy bosqich `is-active` bilan ajratiladi) + dots navigatsiya + "↺ Replay" tugmasi.
- **Interaktivlik:** `IntersectionObserver` orqali ekrandan chiqsa avtomatik aylanish to'xtaydi; `prefers-reduced-motion`da ham to'xtaydi (faqat qo'lda dots bosish ishlaydi).
- **Natija bo'limi:** "Validated analysis" + 4 ta statistika (`2×`, `47%`, `4`, `0` — `Counter` komponenti bilan sanaladi).
- **620px'da:** join SVG diagrammasi gorizontal scroll qilinadi (`min-width:470px`), "swipe to follow" izohi ko'rinadi.

### 4.5 Decisions — [Decisions.jsx](src/components/Decisions/Decisions.jsx)
- **Sarlavha:** "Every choice" / "costs something." (ikkinchisi dim rangda).
- **4 ta kartochka** (`.decision-card`, 2x2 grid, `≤760px`da 1 ustun): har birida raqam+"SEASMP" yorlig'i, sarlavha, sabab matni, "Trade-off" + narx matni, manba havolasi.
- **Hover:** `border-color: var(--accent-line)`, `box-shadow: 0 16px 40px -24px var(--accent-line)`, `translateY(-3px)` (global qoida, [globals.css:436](src/app/globals.css:436)).

### 4.6 WhatIBuild (Capabilities) — [WhatIBuild.jsx](src/components/WhatIBuild/WhatIBuild.jsx)
- **3 guruh** (Full-stack engineering / Data & ML / Security & reliability), har birida ikonka (Code2/Database/ShieldCheck, `lucide-react`) + raqam + ro'yxat (4/3/4 ta element). Har bir element: texnologiya nomi (tarjima qilinmaydi, masalan "React · Next.js · TypeScript") + bitta jumlali tavsif + manba havolasi.
- **760px'da** 1 ustunga tushadi, **960px'da** sarlavha bloki 1 ustunga tushadi.

### 4.7 Experience — [Experience.jsx](src/components/Experience/Experience.jsx)
- **Bitta yozuv** (MIM Logistics LLC), chap tomonda vertikal "timeline" chizig'i (`.experience__entry::before` — nuqta + `box-shadow` halo), lekin **shu bilan bir vaqtda** `border-top` ham mavjud (4.9-bo'limda batafsil, 13-bo'lim Top-15'da).
- **920px'da** 2 ustunli grid 1 ustunga tushadi.

### 4.8 WhoIAm (About) — [WhoIAm.jsx](src/components/WhoIAm/WhoIAm.jsx)
- **2 ustun** (1.35fr/0.85fr): chap — sarlavha + 2 ta paragraf; o'ng — 3 ta fakt (Education/Foundation/Languages), har biri `border-bottom` bilan ajratilgan.
- **920px'da** 1 ustunga tushadi.

### 4.9 Contact — [Contact.jsx](src/components/Contact/Contact.jsx)
- **2 ustun** (0.85fr/1.15fr): chap — taklif matni + email + 3 ta kanal (GitHub/LinkedIn/Telegram) + rezyume havolalari; o'ng — forma (`.cform`, fon `--bg-raise`, `border-radius:18px`).
- **Forma maydonlari:** Name, Email (2 ustunli grid, `≤560px`da 1 ustun), Message (`textarea`), honeypot (`aria-hidden="true"` bilan to'g'ri yashirilgan).
- **Validatsiya:** JS orqali (`required` HTML atributi ham bor, lekin `noValidate` bilan brauzer validatsiyasi o'chirilgan, maxsus JS validatsiya ishlatiladi), xato xabarlari `aria-invalid`/`aria-describedby` bilan bog'langan.
- **Holatlar:** `sending` (`aria-busy`, tugma matni "Sending…"), `ok` (yashil, `#4ade80`), `err` (qizil, `--danger`).
- **920px'da** 1 ustunga tushadi.

### 4.10 Footer — [Footer.jsx](src/components/Footer/Footer.jsx), [BuildLog.jsx](src/components/Footer/BuildLog.jsx)
- **Qatorlar:** chap — nom+izoh+BuildLog; o'ng — 4 ta havola (GitHub/LinkedIn/Telegram/Résumé); eng o'ngda — "Back to top" doira tugmasi (36x36px).
- **BuildLog:** GitHub API'dan (`api.github.com/users/nyxeldev`) jonli repo soni + oxirgi faoliyat, `localStorage` orqali 10 daqiqa keshlangan, `IntersectionObserver` bilan faqat ko'ringanda yuklanadi.
- **560px'da** `.foot__inner` ustunga aylanadi.

### 4.11 CommandCenter — [CommandCenter.jsx](src/components/CommandCenter/CommandCenter.jsx)
- **⌘K/Ctrl+K** bilan ochiladi, `<dialog>`, markazda `min(560px,100%)` panel. Qidiruv input + natijalar ro'yxati (bo'limlar + loyihalar + tashqi havolalar), pastda klaviatura yorliqlari izohi.

### 4.12 404 sahifa — [NotFoundBody.jsx](src/components/NotFound/NotFoundBody.jsx)
- Markazlashtirilgan, "404" kodi (akcent rangda), "This page could not be found." sarlavhasi, "Back to portfolio" tugmasi (strelka chapga, maxsus CSS bilan hover yo'nalishi teskari qilingan — [not-found.css:41-49](src/app/not-found.css:41)).

---

## 5. Komponent inventari

| Komponent | Variantlar/o'lchamlar | Holatlar | Ishlatilgan joy | Dublikat/nomuvofiqlik |
|---|---|---|---|---|
| **Tugma (`.btn`)** | `.btn--primary` (to'q fon), `.btn--ghost` (chegarali) | hover (`translateY(-2px)`), active (`scale(.97)`), disabled (`opacity:.55`) — global, [globals.css:249-293](src/app/globals.css:249) | Hero CTA, 404, forma submit | Yo'q — ikkita variant izchil |
| **Nav CTA (`.nav__resume`)** | Faqat 1 variant, gradient fon | hover (`translateY(-1px)` + kuchliroq shadow), active | Faqat Nav | **Mustaqil uslub** — `.btn--primary`dan farqli, lekin funksional jihatdan "asosiy CTA" bo'lgani uchun aslida `.btn`ning 3-varianti bo'lishi mumkin edi |
| **Sheet CTA (`.sheet__resume`)** | 3-chi, yana boshqacha (`background: var(--ink)`, ichki padding, markazlashgan) | Yo'q (hover yo'q, sensorli qurilma) | Faqat mobil sheet | Yana bir mustaqil "asosiy tugma" uslubi — jami **3 xil** "asosiy CTA" ko'rinishi (`.btn--primary`, `.nav__resume`, `.sheet__resume`) bitta saytda |
| **Input/Textarea (`.field`)** | `input`/`textarea`, bitta uslub | default, `:focus` (akcent chegara+halo), `[aria-invalid]` (qizil chegara) | Faqat Contact forma | Izchil, muammo yo'q |
| **Karta — `.cs`** | 1 variant | hover (border+shadow+translateY) | Work/SEASMP | — |
| **Karta — `.decision-card`** | 1 variant | hover (border+shadow+translateY) | Decisions | Xuddi `.cs` bilan bir xil hover retsepti, lekin alohida CSS qoidasi sifatida qayta yozilgan ([globals.css:433-438](src/app/globals.css:433) — hammasi bitta joyda, aslida yaxshi birlashtirilgan) |
| **Karta — `.capability`, `.experience__entry`** | 1 variant | hover (border+translateY, shadow'siz) | WhatIBuild, Experience | `.experience__entry` qo'shimcha ravishda `border-left`+pseudo-nuqta bilan "timeline" ko'rinishini oladi — boshqa kartalardan vizual uslubda farq qiladi |
| **Karta — `.mini`** | 1 variant | `img` hover (filter), shadow (`.mini__media`) | Work/IELTS | Hover retsepti boshqalardan farqli (rasmga filter, o'ziga emas) |
| **Chip (`.chip`)** | 1 variant | hover (border+color+translateY) | Work/IELTS texnologiya belgilari | — |
| **Navbar** | 1 variant, scroll-reaktiv (`is-stuck`) | default (shaffof), stuck (blur+border), link hover/active | — | — |
| **Mobil sheet (dialog)** | 1 variant | ochiq/yopiq, fokus-trap (`trapDialogTab`) | Nav | — |
| **CommandCenter dialog** | 1 variant | ochiq/yopiq, item hover/`is-on`, bo'sh holat | Global ⌘K | `.cmdk__empty` CSS'da **ikki marta** qarama-qarshi stil bilan e'lon qilingan (markazlashgan/katta vs chapga tekis/kichik — ikkinchisi g'alaba qiladi) |
| **Badge/Chip — `.cs__badge`** | 1 variant | Yo'q | **Hech qayerda ishlatilmaydi topilmadi** (JSX'da `cs__badge` klassi ishlatilishi topilmadi — CSS'da bor, komponentda yo'q) | O'lik CSS qoidasi |
| **Til almashtirgich** | Desktop pill (`.nav__lang-btn`) va mobil pill (`.sheet__lang-btn`) — ikkita alohida CSS, bir xil funksiya | default/hover/is-active | Nav (desktop) + Nav sheet (mobil) | Ikkala variant vizual jihatdan bir-biriga juda yaqin, lekin alohida CSS blok sifatida ikki marta yozilgan (birlashtirish mumkin edi) |

---

## 6. Responsive topilmalar (375/768/1024/1440px)

Playwright orqali barcha 4 breakpointda o'lchandi (`document.documentElement.scrollWidth` vs `clientWidth`):

| Kenglik | Gorizontal overflow | Izoh |
|---|---|---|
| 375px | **Yo'q** (`scrollWidth === clientWidth === 375`) | |
| 768px | **Yo'q** | |
| 1024px | **Yo'q** | |
| 1440px | **Yo'q** | |

Hech qanday kenglikda sahifa eniga siljimadi yoki elementlar bir-birining ustiga tushmadi (qo'lda tekshirilgan skrinshotlar, `design-audit/screenshots/home-*.png`). `.hero__viz` (3D/SVG karta) `≤960px`da to'liq yashiriladi — bu responsive strategiya ataylab (mobil ekranda og'ir vizual elementni ko'rsatmaslik), lekin natijada mobil foydalanuvchi SEASMP arxitekturasini **hech qachon** ko'rmaydi (hatto kattalashtirib aylantirsa ham) — bu kontent yo'qotilishi, faqat layout moslashuvi emas.

**Matn o'lchami:** eng kichik matn — `.mono`/`.sec-label` (11px) va `.jointable__caption`/`.replay__visual-note` kabi SVG/jadval izohlari (9.5-10px). 14px'dan kichik matn WCAG'ning qat'iy qoidasi emas (faqat tavsiya), lekin 9.5-11px — juda kichik, ayniqsa mobil ekranda, va bir vaqtning o'zida past kontrastga ham ega (8-bo'limga qarang) — ikkala muammo birga qo'shiladi.

**Tegish nishoni (tap target) o'lchamlari** (Playwright orqali to'g'ridan-to'g'ri o'lchandi):

| Element | O'lchov (piksel) | WCAG 2.2 AA (24×24) | WCAG 2.5.5 AAA (44×44) |
|---|---|---|---|
| `.foot__top` ("Back to top") | 36×36 | PASS | **FAIL** |
| `.channel__icon` (ikonka, lekin butun `.channel` havola 490×77) | 34×34 (ikonka o'zi), lekin real tegish maydoni 490×77 | PASS | PASS (butun qator hisobga olinsa) |
| `.nav__lang-btn` (desktop, ≥720px) | 30×26 | PASS | **FAIL** |
| `.sheet__lang-btn` (mobil sheet) | 47×35 | PASS | **FAIL** (balandlik) |
| `.sheet__close` | 44×44 | PASS | PASS |
| `.nav__burger` | 44×44 (oxirgi qoida g'alaba qiladi — CSS'da ikki marta e'lon qilingan, 1-chisi 34×34) | PASS | PASS |
| `.cmdk__close` | 44×44 | PASS | PASS |

Xulosa: barcha tegish nishonlari WCAG 2.2 Level AA minimal talabidan (24×24px) **o'tadi**, lekin `.foot__top`, `.nav__lang-btn`, `.sheet__lang-btn` AAA (44×44px) darajasidan past.

---

## 7. Accessibility (qulaylik) topilmalari

### 7.1 Rang kontrasti — to'liq jadval

Hisoblangan WCAG kontrast nisbatlari (haqiqiy token qiymatlari asosida, dasturiy ravishda hisoblangan; Lighthouse ham mustaqil ravishda xuddi shu `--ink-3`/`--bg` juftligini **4.18:1** deb aniqladi — mos keladi):

| Juftlik | Nisbat | AA oddiy matn (4.5:1) | AA katta matn (3:1) |
|---|---|---|---|
| `--ink` / `--bg` (#f0f0ec/#2b2d31) | 12.07 | PASS | PASS |
| `--ink-2` / `--bg` (#b4b4ad/#2b2d31) | 6.62 | PASS | PASS |
| **`--ink-3` / `--bg`** (#8e8e88/#2b2d31) | **4.19** | **FAIL** | PASS |
| **`--ink-4` / `--bg`** (#7d7d78/#2b2d31) | **3.33** | **FAIL** | PASS |
| `--ink` / `--bg-raise` | 10.08 | PASS | PASS |
| `--ink-2` / `--bg-raise` | 5.53 | PASS | PASS |
| **`--ink-3` / `--bg-raise`** | **3.50** | **FAIL** | PASS |
| **`--ink-4` / `--bg-raise`** (placeholder matn ham shu) | **2.78** | **FAIL** | **FAIL** |
| `--ink` / `--bg-sunk` | 13.28 | PASS | PASS |
| `--ink-3` / `--bg-sunk` | 4.61 | PASS (chegarada) | PASS |
| **`--ink-4` / `--bg-sunk`** | **3.67** | **FAIL** | PASS |
| `--accent` / `--bg` | 5.68 | PASS | PASS |
| `--danger` / `--bg` | 6.08 | PASS | PASS |
| `--on-ink` / `--ink` (`.btn--primary`) | 12.07 | PASS | PASS |
| `--on-accent` / `--accent` | 6.95 | PASS | PASS |
| DataStory `--ink`/bg (#f4f4f1/#09090b) | 18.05 | PASS | PASS |
| DataStory `--ink-4`/bg | 4.81 | PASS | PASS |
| `.cform__status.is-ok` (#4ade80) / `--bg-raise` | 6.61 | PASS | PASS |

**Eng muhim topilma:** `--ink-3` va `--ink-4` — saytning eng ko'p ishlatiladigan ikkinchi/uchinchi darajali matn ranglari (`.mono`, `.sec-label`, barcha metama'lumot, fakt yorliqlari, nav default holat, footer matnlari, forma placeholder'lari) — **asosiy fon ustida WCAG AA oddiy matn talabini qondirmaydi**. Bu Lighthouse tomonidan ham mustaqil tasdiqlangan (ikkita aniq misol: `#work` va `#decisions` bo'lim yorliqlari, pastga qarang).

### 7.2 Lighthouse (dev-server ustida, `npm run dev`, chrome headless)

| Kategoriya | Ball |
|---|---|
| Performance | 0.72 |
| Accessibility | 0.96 |
| Best Practices | 1.00 |
| SEO | 0.92 |

**Muhim eslatma:** bu audit **dev server** ustida o'tkazildi (production statik export emas), shuning uchun Performance balli real production holatini aks ettirmaydi (dev rejimida hot-reload/source-map kodi ham yuklanadi, Total Blocking Time 2130ms — bu son production build'da sezilarli darajada yaxshi bo'lishi kutiladi, lekin **tekshirilmagan**, chunki statik export serveri ishga tushirilmadi).

Lighthouse'ning "SEO 0.92" balli "Document does not have a meta description" deb ko'rsatdi — **bu yolg'on signal**: `curl` orqali tekshirilganda `<meta name="description" content="Full-Stack Developer building data-driven, intelligent, and security-focused systems."/>` mavjudligi tasdiqlandi. Bu — dev-server'ning Lighthouse auditini vaqtida to'liq DOM tayyor bo'lmasdan o'tkazishi bilan bog'liq metodologik nosozlik, saytning haqiqiy kamchiligi emas.

Lighthouse `color-contrast` audити **0 ball** bilan muvaffaqiyatsiz bo'ldi, aniq element ko'rsatib: `section#work > div.shell > div.sec-label > span` ("SELECTED WORK" matni) va `section#decisions > div.shell > div.sec-label > span` ("ENGINEERING DECISIONS" matni) — ikkalasi ham `--ink-3`/`--bg` juftligi, 4.18:1 nisbat (yuqoridagi jadvalga mos).

### 7.3 Boshqa a11y tekshiruvlari

- **Rasmlarda `alt`:** sahifada bor-yo'g'i **1 ta** haqiqiy `<img>` elementi bor (IELTS skrinshoti) — unda to'liq, tavsiflovchi `alt` matni mavjud. Qolgan barcha vizual elementlar SVG (o'z `role="img"`/`aria-label` yoki `<title>`/`<desc>` bilan) yoki `lucide-react` ikonkalar (`aria-hidden` kerak bo'lganda qo'llangan).
- **Forma yorliqlari:** barcha asosiy maydonlar (`name`, `email`, `message`) `<label htmlFor>` bilan to'g'ri bog'langan. Honeypot maydoni (`company_website`) ham yorliqqa ega, lekin butun blok `aria-hidden="true"` bilan ekran o'quvchisidan to'g'ri yashirilgan ([Contact.jsx:253](src/components/Contact/Contact.jsx:253)) — to'g'ri amalga oshirilgan.
- **Sarlavha ierarxiyasi:** sahifada aniqlangan tartib — bitta `<h1>` ("NYXELDEV", Hero), so'ngra har bir bo'lim uchun `<h2>`, ichida `<h3>`/`<h4>` — **o'tkazib yuborish yo'q**, mantiqiy tartib saqlangan (haqiqiy DOM skanerida tasdiqlandi).
- **`:focus-visible`:** global qoida bor ([globals.css:176-180](src/app/globals.css:176)) — `outline:2px solid var(--accent)`. Bu **akcent rang** (`#7ea4ff`) fon ustida 5.68:1 kontrastga ega — fokus indikatori o'zi yetarli kontrastli.
- **`lang` atributi:** `<html lang="en">` — [layout.js:85](src/app/layout.js:85) qattiq kodlangan va **til almashtirilganda hech qachon yangilanmaydi** (UZ yoki RU tanlansa ham `lang="en"` qolaveradi). Bu ekran o'quvchilar uchun noto'g'ri talaffuz/til e'loniga olib kelishi mumkin — aniq, tekshirilgan nosozlik.
- **Skip-link:** mavjud (`.skip`, fokusda ko'rinadi) — [globals.css:383-397](src/app/globals.css:383).
- **Semantik HTML:** `<main id="main">`, `<nav>`, `<footer>`, `<dialog>` to'g'ri ishlatilgan.

---

## 8. Izchillik muammolari (to'liq ro'yxat)

1. **Ikki marta e'lon qilingan CSS qoidalari** (fayl oxiriga "premium" qatlami sifatida qo'shilgan, birinchi qoidani bekor qiladi) — bir nechta faylda takrorlanadigan pattern:
   - [work.css:1](src/components/Work/work.css:1) va [work.css:375-397](src/components/Work/work.css:375) — `.work__head`, `.cs`, `.cs__title`, `.cs__highlights`, `.next`, `.mini__media` barchasi ikki marta.
   - [data-story.css:509-540](src/components/DataStory/data-story.css:509) va [data-story.css:621-624](src/components/DataStory/data-story.css:621) — `.stat`, `.statrow` ikki marta.
   - [experience.css:12-15](src/components/Experience/experience.css:12) va [experience.css:37-38](src/components/Experience/experience.css:37) — `.experience__entry` ikki marta, ikkita turli vizual konsepsiya (border-top vs border-left+timeline nuqta) **bir vaqtda qo'llanadi** (ikkisi ham bekor qilinmagan, ikkalasi ham faol).
   - [nav.css:226-231](src/components/Nav/nav.css:226) va [nav.css:399-402](src/components/Nav/nav.css:399) — `.nav__burger` ikki marta (34×34 → 44×44).
   - [command-center.css:154-159](src/components/CommandCenter/command-center.css:154) va [command-center.css:208-213](src/components/CommandCenter/command-center.css:208) — `.cmdk__empty` ikki marta, qarama-qarshi `text-align`.
   
   Bu holat funksional buzilish keltirib chiqarmaydi (CSS kaskadi oxirgi qoidani qo'llaydi), lekin kodni o'qish/tahrirlashni qiyinlashtiradi va kelajakda birinchi qoidani o'chirish/o'zgartirishga urinilganda kutilmagan natijaga olib kelishi mumkin.

2. **3 xil "asosiy CTA" tugma uslubi bitta saytda:** `.btn--primary` (Hero/404/forma), `.nav__resume` (nav, gradient), `.sheet__resume` (mobil sheet, oddiy to'q fon) — barchasi "eng muhim harakat" vazifasini bajaradi, lekin vizual tilda bir-biridan farq qiladi.

3. **Rang tokenlashtirilmagan takrorlanishlar:** `#16a34a` ikki faylda qo'lda takrorlangan (token emas); `#ff8f8f` (DataStory xato rangi) va `--danger:#ff8a8a` (global xato rangi) bir-biriga juda yaqin, lekin bir xil emas — ataylab qilingan farqmi yoki tasodifiy chetlanishmi — **ANIQLANMADI** (UNCLEAR: ikkala qiymat ham "xato/salbiy" semantikasida ishlatiladi, lekin turli fayllarda mustaqil belgilangan).

4. **4 ta "ishlatilmaydigan" token** `:root`da e'lon qilingan, lekin hech qaysi `.css` faylda ishlatilmagan: `--bg-ink`, `--on-ink-2`, `--line-ink`, `--accent-lo`, `--cyan` (jami 5 ta, ro'yxat 3.1-bo'limda).

5. **Breakpoint qiymatlari standartlashtirilmagan** — 12 xil `max-width` qiymati, aniq "sm/md/lg" nomlanish yo'q (3.5-bo'lim).

6. **Radius shkalasi qisman tokenlashtirilgan** — `--radius`(4px)/`--radius-lg`(18px) bor, lekin `6px, 8px, 12px, 14px, 22px, 100px` kabi qo'shimcha qiymatlar har xil joyda qattiq kodlangan, oraliq token (masalan `--radius-md`) yo'q.

7. **`.cs__badge` CSS qoidasi** ([work.css:63-69](src/components/Work/work.css:63)) — JSX'da hech qanday joyda `cs__badge` klassi ishlatilmaydi (qidiruv natijasi: 0 ta moslik `Work.jsx`da) — o'lik/eskirgan CSS.

8. **SystemDiagram'ning CSS'i Hero'ning mahalliy o'zgaruvchilariga qaram** — `system-diagram.css`dagi `.sysdia__controls`/`.sysdia__note`/`.sysdia__trace*` qoidalari `--ctrl-text`, `--note-line`, `--note-label` kabi o'zgaruvchilarni ishlatadi, lekin bu o'zgaruvchilar **faqat** [hero.css:45-51](src/components/Hero/hero.css:45)dagi `.hero__viz` selektorida e'lon qilingan. Agar `SystemDiagram` komponenti kelajakda boshqa joyda (masalan alohida sahifada) ishlatilsa, bu matnlar ranglari aniqlanmagan (`unset`/meros) bo'lib qoladi.

---

## 9. UX / vizual ierarxiya muammolari

- **Hero:** Ko'z birinchi "NYXEL/DEV" katta sarlavhaga, keyin o'ng tomondagi yorqin ko'k "konsol karta"ga tushadi — ierarxiya aniq, ikkita CTA farqlanadi (to'q primary vs chegarali ghost). Muammo yo'q.
- **Work/SEASMP:** Karta juda uzun (sarlavha → highlight → overview → stackmap → 4 detail → testing → next steps/`<details>`) — "devor-matn" hissi beradi, ayniqsa 4 ta detail karta matnlari zich joylashgan ([work.css:349-354](src/components/Work/work.css:349), `line-height:1.7` bilan yumshatilgan, lekin umumiy hajm katta). `<details>` elementi ichidagi "Limits & next steps" standart ko'rinishda yopiq boshlanadi — bu yaxshi (kamroq matn ko'rsatadi), lekin ba'zi foydalanuvchilar uni umuman ochmasligi mumkin (muhim "cheklovlar" ma'lumoti yashirin qoladi).
- **DataStory:** Eng kuchli vizual nuqta — qora fon, aniq kontrast, 3 bosqichli animatsion hikoya juda samarali e'tibor tortadi. Zaif tomon: avtomatik aylanish (`3600ms` interval) foydalanuvchi o'qib ulgurmasa ham davom etadi — o'qish tezligi past foydalanuvchilar uchun matn almashinib ketishi mumkin (lekin `dots` orqali qo'lda boshqarish mavjud, va ekrandan chiqsa to'xtaydi).
- **Decisions/WhatIBuild/Experience/WhoIAm:** Barchasi bir xil "chap sarlavha, o'ng intro" patterniga ega — izchil, lekin orqama-ketin 4 ta bo'lim bir xil kompozitsion formula bilan kelgani uchun sahifa o'rtasi biroz monoton bo'lib qoladi (vizual farqlanish faqat matn/karta ichida, layout darajasida emas).
- **Contact:** Chap tomondagi "taklif" bloki va forma orasidagi vizual og'irlik muvozanatli; forma o'zi aniq va kam-elementli, kognitiv yuk past.
- **Bo'limlar orasidagi kontrast:** DataStory (qora) dan keyin yana oddiy Dusk foniga qaytish biroz "soning" his qiladi — lekin bu ataylab qilingan ritm (bitta kuchli urg'u, qolgani neytral), funksional jihatdan muammo emas.

---

## 10. Performance va texnik masalalar

- **Rasmlar:** saytda bor-yo'g'i 1 ta optimallashtirilmagan bo'lmagan raster rasm (`ielts-1100.webp`, allaqachon WebP, responsive `srcSet` bilan). `next/image` butunlay o'chirilgan (`images.unoptimized:true`, statik export talabi) — lekin amalda muammo tug'dirmaydi, chunki deyarli hech qanday raster rasm ishlatilmaydi.
- **CLS (Cumulative Layout Shift):** Lighthouse — **0.001** (deyarli nol, a'lo natija).
- **Font flash:** `display:"swap"` ikkala shriftda ham ishlatilgan — qisqa FOUT (flash of unstyled text) mumkin, lekin bu ataylab qilingan, standart amaliyot.
- **Console xatolari (to'liq scroll-through davomida kuzatilgan):**
  - `info`: React DevTools taklifi — normal, muammo emas.
  - `warning` (4 marta): `GL Driver Message ... GPU stall due to ReadPixels` — WebGL/3D sahna drayver darajasidagi ogohlantirish, funksional xato emas, faqat GPU ishlash diagnostikasi.
  - `error` (2 marta): `Failed to load resource: 403`. Aniq URL audit vaqtida ikkinchi marta takrorlanmadi (keshlangan holat tufayli) — **UNCLEAR**: eng ehtimolli manba `api.github.com` (BuildLog komponenti ishlatadigan tashqi API, tez-tez so'rov yuborilsa GitHub tomonidan rate-limit/403 qaytarishi mumkin), lekin aniq tasdiqlanmadi.
- **Lighthouse Performance 0.72** — yuqorida aytilganidek, bu **dev server** balli, production emas. Total Blocking Time — 2130ms (dev rejimida kutilgan, chunki kod minifikatsiyalanmagan va source map'lar yuklanadi).
- **Keshlash:** BuildLog `localStorage` orqali 10 daqiqalik keshga ega — tashqi API so'rovlarini kamaytirish uchun to'g'ri yondashuv.

---

## 11. Qoldiqlar (leftovers)

- **Lorem ipsum / shablon matni:** topilmadi (`grep` orqali tekshirildi, 0 ta moslik).
- **TODO/FIXME izohlari:** topilmadi.
- **Favicon:** mavjud (`/images/favicon.ico`, `<link rel="icon">` orqali to'g'ri bog'langan).
- **OG-rasm:** mavjud (`/images/og.png`, 1200×630, `og:image` va `twitter:image` ikkalasida ham).
- **Meta-description:** mavjud (7.2-bo'limda tasdiqlangan).
- **O'lik CSS:** `.cs__badge` (5-bo'lim, #7), 5 ta ishlatilmagan `:root` tokeni (3.1-bo'lim).
- **`artifacts/` papkasi** (loyiha ildizida) — 40+ eski skrinshot/JSON fayl (`axe-*.json`, `premium-*.png`, `hero-*.png` va h.k.) — bu oldingi auditlar/tekshiruvlardan qolgan, hozirgi audit doirasiga kirmaydi, lekin repozitoriyani shishirgan "qoldiq" sifatida qayd etiladi (o'chirish yoki `.gitignore`ga qo'shish tavsiya etilishi mumkin edi, lekin bu audit kod o'zgartirishni taqiqlaydi).

---

## 12. Skrinshotlar ro'yxati

Barchasi `design-audit/screenshots/` papkasida:

| Fayl | Tavsif |
|---|---|
| `home-375.png` | To'liq sahifa, 375px (mobil), real scroll-through orqali barcha reveal-animatsiyalar faollashtirilgandan keyin olingan |
| `home-768.png` | To'liq sahifa, 768px (planshet) |
| `home-1024.png` | To'liq sahifa, 1024px |
| `home-1440.png` | To'liq sahifa, 1440px (desktop) |
| `mobile-menu-375.png` | Mobil burger menyu ochiq holati, 375px |
| `lang-ru-1440.png` | Sayt RU tiliga almashtirilgan holat, 1440px (Hero ko'rinishi) |
| `lang-uz-1440.png` | Sayt UZ tiliga almashtirilgan holat, 1440px (Hero ko'rinishi) |
| `cmdk-1440.png` | CommandCenter (⌘K) dialogi ochiq holati, 1440px |
| `hero-btn-hover-1440.png` | Hero asosiy tugmasining hover holati (yaqin kadr) |
| `404-1440.png` | 404 sahifasi, to'liq, 1440px |

**Metodologik eslatma:** birinchi urinishda (haqiqiy scroll'siz, faqat Playwright'ning `full_page=True` + CDP viewport-kengaytirish usuli bilan) olingan skrinshotlarda bo'limlarning katta qismi **bo'sh** ko'rinardi — bu `IntersectionObserver` asosidagi `Reveal` animatsiyasining haqiqiy scroll hodisasisiz to'g'ri ishga tushmasligi bilan bog'liq **skrinshot artefaкти** edi, saytning haqiqiy nosozligi EMAS. Bu DOM darajasida tasdiqlandi (`getComputedStyle(...).opacity` barcha asosiy kartalar uchun haqiqiy scroll-through'dan keyin `1`ga teng ekanligi tekshirildi) va skrinshotlar shunga mos ravishda to'g'ri usul (sahifa bo'ylab bosqichma-bosqich scroll qilib, keyin screenshot olish) bilan qayta olindi.

---

## 13. TOP 15 — eng muhim dizayn muammolari (vizual ta'sir bo'yicha tartiblangan)

1. **Ikkinchi/uchinchi darajali matn (`--ink-3`, `--ink-4`) asosiy fonlarda WCAG AA kontrastidan past** — `--ink-3`/`--bg`=4.19:1, `--ink-4`/`--bg`=3.33:1, `--ink-4`/`--bg-raise`=2.78:1 (talab: 4.5:1). Qayerda: [globals.css:16-18](src/app/globals.css:16) (token e'loni) + deyarli har bir `.mono`/`.sec-label` ishlatilgan joy (10+ fayl). Nega yomon: har bir bo'lim yorlig'i, metama'lumot, forma placeholder matni past ko'rish qobiliyatiga ega foydalanuvchilar uchun o'qib bo'lmaydigan darajada xira. **Jiddiylik: KRITIK.**

2. **`.cs__title` ("SEASMP") font-size ikki marta e'lon qilingan, ikkinchisi h3 elementini h1'dan ham kattaroq qiladi** — [work.css:37](src/components/Work/work.css:37) (`var(--t-h2)`) vs [work.css:379](src/components/Work/work.css:379) (`clamp(2.5rem,5vw,4.5rem)`, g'olib). Nega yomon: semantik `<h3>` vizual ravishda sahifadagi eng katta matn bo'lib chiqadi — sarlavha ierarxiyasi vizual jihatdan chalkashadi. **Jiddiylik: YUQORI.**

3. **`.experience__entry` ikki ziddiyatli vizual konsepsiya bilan ikki marta e'lon qilingan** (border-top+padding-top VA border-left+timeline-nuqta, ikkalasi ham faol) — [experience.css:12-15](src/components/Experience/experience.css:12) va [experience.css:37-38](src/components/Experience/experience.css:37). Nega yomon: elementda bir vaqtning o'zida ikkita turli "chegaralash" vizual tili mavjud bo'lishi mumkin, bu kelajakda birini o'zgartirishda kutilmagan natijaga olib keladi. **Jiddiylik: O'RTA-YUQORI.**

4. **Bitta saytda 3 xil "asosiy CTA" tugma uslubi** (`.btn--primary`, `.nav__resume`, `.sheet__resume`) — [globals.css:275-278](src/app/globals.css:275), [nav.css:195-212](src/components/Nav/nav.css:195), [nav.css:351-360](src/components/Nav/nav.css:351). Nega yomon: "eng muhim harakat" vizual tili barqaror emas, foydalanuvchi bir xil darajadagi harakatlar uchun turli ko'rinishlarni ko'radi. **Jiddiylik: O'RTA.**

5. **`<html lang="en">` til almashtirilganda yangilanmaydi** — [layout.js:85](src/app/layout.js:85). Nega yomon: RU/UZ tanlangan foydalanuvchilar uchun ekran o'quvchilar sahifani noto'g'ri tilda o'qiydi (masalan, rus matnini ingliz talaffuzi qoidalari bilan). **Jiddiylik: YUQORI (a11y).**

6. **Mobil ekranda (`≤960px`) `.hero__viz` (arxitektura vizуали) butunlay yashiriladi — SEASMP diagrammasi mobil foydalanuvchiga umuman ko'rinmaydi** — [hero.css:75](src/components/Hero/hero.css:75). Nega yomon: portfolioning eng "texnik chuqurlik"ni ko'rsatadigan vizual elementi aholining katta qismi (mobil tashrif buyuruvchilar) uchun butunlay yo'qoladi, faqat skroll pastga tushganda SEASMP bo'limida matn ko'rinishida qoladi. **Jiddiylik: O'RTA-YUQORI.**

7. **`.cmdk__empty` qarama-qarshi stil bilan ikki marta e'lon qilingan** (markazlashgan/katta → chapga tekis/kichik+border-top, ikkinchisi g'olib) — [command-center.css:154-159](src/components/CommandCenter/command-center.css:154) vs [command-center.css:208-213](src/components/CommandCenter/command-center.css:208). Nega yomon: kod o'qiganda birinchi qoida "yolg'on signal" beradi — real natija faqat oxirgi qoidani ko'rib tasdiqlanadi. **Jiddiylik: PAST (faqat texnik qarz, vizual ta'siri kam).**

8. **`--ink-4` rangi forma placeholder matni uchun ham ishlatiladi, kontrast 2.78:1 — WCAG katta-matn chegarasidan ham past** — [contact.css:55](src/components/Contact/contact.css:55). Nega yomon: forma maydonlarining placeholder izohlari past ko'rish qobiliyatiga ega foydalanuvchilar uchun deyarli o'qib bo'lmaydi. **Jiddiylik: YUQORI (a11y, amaliy forma qulayligi).**

9. **5 ta `:root` tokeni (`--bg-ink`, `--on-ink-2`, `--line-ink`, `--accent-lo`, `--cyan`) hech qayerda ishlatilmaydi** — [globals.css:12,20,26,31-32](src/app/globals.css:12). Nega yomon: dizayn tizimini o'qigan kishi bu tokenlar faol ishlatiladi deb o'ylaydi, lekin ular o'lik kod — chalkashlik va texnik qarz manbai. **Jiddiylik: PAST.**

10. **`SystemDiagram`ning CSS'i faqat Hero'ning mahalliy `.hero__viz` o'zgaruvchilariga tayanadi, o'z-o'zidan ishlay olmaydi** — [system-diagram.css:146-151](src/components/SystemDiagram/system-diagram.css:146) vs [hero.css:45-51](src/components/Hero/hero.css:45). Nega yomon: komponent "qayta ishlatiluvchi" deb nomlansa ham, haqiqatda faqat bitta aniq ota-element kontekstida to'g'ri render bo'ladi — yashirin qattiq bog'liqlik. **Jiddiylik: O'RTA.**

11. **12 xil nomlanmagan breakpoint qiymati** (500-1180px oralig'ida) — izchil "sm/md/lg" tizimi yo'q. Nega yomon: yangi komponent qo'shilganda qaysi breakpointdan foydalanish kerakligi haqida aniq qoida yo'q, natijada vaqt o'tishi bilan yana ko'proq tarqoq qiymatlar qo'shilishi mumkin. **Jiddiylik: PAST (faqat kelajakdagi qo'llab-quvvatlash xavfi).**

12. **`.foot__top`, `.nav__lang-btn`, `.sheet__lang-btn` tegish nishonlari 44×44px AAA chegarasidan past** (36×36, 30×26, 47×35) — [footer.css:80-90](src/components/Footer/footer.css:80), [nav.css:168-178](src/components/Nav/nav.css:168), [nav.css:373-384](src/components/Nav/nav.css:373). Nega yomon: mobil/sensorli qurilmalarda bu kichik tugmalarni aniq bosish qiyinroq, ayniqsa katta barmoqli yoki motorli qiyinchiliklari bor foydalanuvchilar uchun. **Jiddiylik: PAST-O'RTA.**

13. **`#16a34a` (yashil holat nuqtasi) va `#4ade80` (forma muvaffaqiyat matni) — ikkita turli "muvaffaqiyat yashil"i, tokenlashtirilmagan** — [hero.css:32](src/components/Hero/hero.css:32), [footer.css:43](src/components/Footer/footer.css:43), [contact.css:108](src/components/Contact/contact.css:108). Nega yomon: semantik jihatdan bir xil ma'noni ("ijobiy/faol holat") anglatuvchi ikkita yaqin, lekin har xil rang — vizual mikro-nomuvofiqlik, token orqali birlashtirilishi mumkin edi. **Jiddiylik: PAST.**

14. **`.cs__badge` CSS qoidasi yozilgan, lekin hech qanday JSX'da ishlatilmaydi** — [work.css:63-69](src/components/Work/work.css:63). Nega yomon: o'lik kod, kelajakda kimdir uni "ishlatilmoqda" deb o'ylab tahrirlashga vaqt sarflashi mumkin. **Jiddiylik: PAST.**

15. **DataStory bo'limi o'zining mustaqil "mikro-tema"siga ega (qora fon + qayta aniqlangan token to'plami), lekin bu holat loyihaning boshqa hech bir joyida hujjatlashtirilmagan yoki izohlanmagan naming pattern sifatida qayd etilmagan** — [data-story.css:1-19](src/components/DataStory/data-story.css:1). Nega yomon: o'zi funksional muammo emas (vizual jihatdan ataylab va chiroyli ishlaydi), lekin "yagona Dusk sxemasi" tamoyiliga tashqi ko'rinishda zid bo'lib tuyulishi mumkin — kelajakdagi dizaynerlar buni "nomuvofiqlik" deb xato tushunib, "tuzatishga" urinishi mumkin, holbuki bu ataylab qilingan qaror. **Jiddiylik: PAST (hujjatlashtirilmaganlik xavfi).**

---

## 14. Xom ma'lumotlar ilovasi — `globals.css` to'liq matni

To'liq fayl allaqachon 6-bo'limgacha bo'lgan tahlilda ko'rsatilgan tuzilishga mos; quyida `:root` blokining so'zma-so'z nusxasi ([globals.css:7-71](src/app/globals.css:7)):

```css
:root {
  /* Sirtlar — Dusk: yagona sxema, na to'q-qora, na oq */
  --bg: #2b2d31;
  --bg-raise: #38393e;
  --bg-sunk: #242629;
  --bg-ink: #f0f0ec;

  /* Matn */
  --ink: #f0f0ec;
  --ink-2: #b4b4ad;
  --ink-3: #8e8e88;
  --ink-4: #7d7d78;
  --on-ink: #2b2d31;
  --on-ink-2: #4a4a46;

  /* Chiziqlar */
  --line: #35373c;
  --line-2: #44454b;
  --line-strong: #6f7076;
  --line-ink: #e4e4de;

  /* Akcent — electric blue / cyan */
  --accent: #7ea4ff;
  --accent-hi: #a0bdff;
  --accent-lo: #5f85e0;
  --cyan: #2ad8ff;
  --accent-wash: rgba(126, 164, 255, 0.12);
  --accent-line: rgba(126, 164, 255, 0.3);
  /* akcent foni ustidagi matn */
  --on-accent: #1b1d20;

  --danger: #ff8a8a;

  /* Shriftlar */
  --sans:
    var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace;

  /* Tipografik shkala — fluid */
  --t-display: clamp(2.75rem, 1.2rem + 6.4vw, 7rem);
  --t-h1: clamp(2.25rem, 1.2rem + 4.2vw, 4.5rem);
  --t-h2: clamp(1.75rem, 1.1rem + 2.6vw, 3rem);
  --t-h3: clamp(1.25rem, 1rem + 1.1vw, 1.75rem);
  --t-lead: clamp(1.0625rem, 0.98rem + 0.5vw, 1.375rem);
  --t-body: 1rem;
  --t-sm: 0.875rem;
  --t-xs: 0.75rem;
  --t-mono: 0.6875rem;

  /* Ritm */
  --gut: clamp(1.25rem, 0.6rem + 2.6vw, 3.5rem);
  --sec-y: clamp(3.5rem, 2rem + 5vw, 6.5rem);
  --max: 1320px;
  --max-text: 58ch;

  /* Harakat */
  --e-out: cubic-bezier(0.16, 1, 0.3, 1);
  --e-io: cubic-bezier(0.65, 0, 0.35, 1);
  --d-fast: 0.18s;
  --d-mid: 0.4s;
  --d-slow: 0.8s;

  --radius: 4px;
  --radius-lg: 18px;
}
```

`Inter`/`JetBrains_Mono` shrift konfiguratsiyasi ([layout.js:6-17](src/app/layout.js:6)):
```js
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});
```

DataStory bo'limining mahalliy token qayta-aniqlanishi ([data-story.css:1-19](src/components/DataStory/data-story.css:1)):
```css
.datastory {
  background: #09090b;
  color: #f4f4f1;
  margin-block: clamp(3rem, 7vw, 6rem);
  overflow: hidden;
  --ink: #f4f4f1;
  --ink-2: #b0b0a9;
  --ink-3: #8e8e88;
  --ink-4: #7d7d78;
  --line: #222228;
  --line-2: #33333b;
  --accent: #5b8bff;
  --on-accent: #08080a;
  --accent-line: rgba(91, 139, 255, 0.35);
  --accent-wash: rgba(91, 139, 255, 0.12);
}
```

Hero'ning mahalliy "konsol karta" token qayta-aniqlanishi ([hero.css:43-56](src/components/Hero/hero.css:43)):
```css
.hero__viz {
  --ink-2: #becbe1; --ink-4: #91a0b8; --accent: #86adff;
  --line-2: #344563; --accent-line: #385581; --accent-wash: rgba(102,155,255,.12);
  --bg-raise: #142139; --viz-dot: #6b84ab; --viz-dot-o: .13;
  --viz-cap: #a2b2cc;
  --note-line: #30415f; --note-label: #9ebae8; --note-text: #bac7dc;
  --ctrl-text: #a6b5ce; --ctrl-hover-text: #f0f5ff; --ctrl-hover-bg: #1b2b46;
  --ctrl-active-border: #456798; --ctrl-active-text: #d7e5ff; --ctrl-active-bg: #1b2e4d;
  position: relative; display: flex; flex-direction: column; align-items: center;
  gap: 1.25rem; padding: 1.4rem 1.5rem; border: 1px solid #314361;
  border-radius: 22px; background: radial-gradient(ellipse at 50% 40%, #182c4a, #0c1525 75%);
  box-shadow: 0 30px 80px -40px rgba(14,37,75,.6), inset 0 1px 0 rgba(255,255,255,.08);
}
```

---

## Hujjat tasdiqlash — loyiha fayllari o'zgartirilmagani haqida

Quyida audit boshlangandan oxirigacha `git status` natijasi keltirilgan. **Diqqat:** ko'rsatilgan `M`/`D`/`??` yozuvlarining barchasi ushbu audit **boshlanishidan OLDIN**, suhbatning oldingi (asosiy) sessiyasida qilingan NYXELDEV qayta-brending/i18n/navbar ishi natijasidir — bu audit ularning HECH BIRIGA tegmadi. Ushbu audit tomonidan yaratilgan **yagona** yangi element — `design-audit/` papkasi (hisobot + skrinshotlar), `??` qatorida alohida ko'rsatilgan:

```
 M package-lock.json
 M package.json
 M src/app/globals.css
 M src/app/layout.js
 M src/app/not-found.js
 M src/components/CommandCenter/CommandCenter.jsx
 M src/components/CommandCenter/command-center.css
 M src/components/Contact/Contact.jsx
 M src/components/Contact/contact.css
 M src/components/DataStory/DataStory.jsx
 M src/components/DataStory/data-story.css
 M src/components/Decisions/Decisions.jsx
 M src/components/Decisions/decisions.css
 M src/components/Experience/Experience.jsx
 M src/components/Footer/BuildLog.jsx
 M src/components/Footer/Footer.jsx
 M src/components/Hero/Hero.jsx
 M src/components/Hero/hero.css
 M src/components/Nav/Nav.jsx
 M src/components/Nav/nav.css
 M src/components/SystemDiagram/SystemDiagram.jsx
 M src/components/SystemDiagram/system-diagram.css
 M src/components/WhatIBuild/WhatIBuild.jsx
 M src/components/WhoIAm/WhoIAm.jsx
 M src/components/Work/Work.jsx
 D src/hooks/useTheme.js
 M src/lib/site.js
 M tests/portfolio_regression.py
?? .claude/
?? design-audit/              <-- SHU AUDIT TOMONIDAN YARATILDI
?? src/components/DataStory/InvestigationReplay.jsx
?? src/components/NotFound/
?? src/components/SystemDiagram/SystemDiagramScene.jsx
?? src/components/SystemDiagram/TraceLine.jsx
?? src/hooks/useLanguage.js
?? src/lib/i18n/
```

**Xulosa:** ushbu audit davomida `design-audit/` papkasidan tashqari **hech qanday** fayl yaratilmadi, o'zgartirilmadi yoki o'chirilmadi. `npm`/`npx` paketlari global/npx-cache orqali ishlatildi, loyihaning `package.json`/`package-lock.json`ga hech narsa qo'shilmadi.
