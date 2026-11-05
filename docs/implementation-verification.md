# Implementation verification — 8 October 2026

## Evidence reviewed

- SEASMP: `c2bded3aa5cb1464f6c908a004d9eee9b685cf99`.
- IELTS frontend: `16a3e00b6275b2c621c6cc4fcef4fdd11a485d73`.
- Supplied resume and current portfolio source, assets, configuration and static runtime.

The model-promotion and QR findings were confirmed at the inspected SEASMP revision. Copy now distinguishes evaluation from conditional promotion, course/date enrollment checks from identity or physical-presence proof, JWT access from opaque rotating refresh tokens, IP limits from actor limits, selected audit events from comprehensive auditing, and configured CI from observed successful runs. Logistics investigation outcomes remain attributed to the supplied records; architecture specifications are not presented as deployed automation.

The previous stale-export observations were superseded by fresh builds. No external project repository was modified.

## Checks completed

- `npm run lint`: passed.
- `npm run build`: passed, static export preserved. Next.js reports 111 kB first-load JavaScript for `/`; this is a build estimate, not a Lighthouse score.
- `npm test`: eight behavioral tests passed against the fresh export, with no observed browser page errors.
- Widths: 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px; also 390×667 and 844×390. No unintended horizontal document overflow detected.
- Keyboard menu/palette selection, Escape, focus restoration and scroll-lock cleanup passed.
- JavaScript-disabled content, essential links, saved/invalid/unavailable theme storage, reduced motion and resume assets passed.
- Form validation, focus, preserved failure input and simulated provider success passed. No real contact submission was sent.
- GitHub partial profile results and cached reload passed with intercepted requests.
- Canonical, language, assets and local custom 404 checked.
- axe-core 4.14.0 WCAG A/AA checks reported no violations for the light/dark page, mobile menu and command palette. This does not replace a full assistive-technology review.
- Rendered mobile/desktop sections, authentic IELTS image, social image and the regenerated one-page resume were visually reviewed. Exported PDF matches the regenerated source PDF.
- `npm audit --omit=dev --json`: zero findings. Five development-only ESLint dependency findings remain; see README.
- `git diff --check`: passed (only repository line-ending conversion notices).

Screenshots and local navigation/resource measurements are in ignored `artifacts/`. The local server is unthrottled and uncompressed; measurements must not be presented as real-user performance or a guaranteed score. The favicon fell from 1,468,590 to 2,708 bytes; the responsive IELTS images are 5,480 and 10,928 bytes.

## Outstanding external verification

- `nyxeldev.pro` DNS/HTTPS could not resolve from this environment, including a retry outside the sandbox. Worldwide availability remains **UNVERIFIED**.
- The newly added CI workflow has not been pushed or executed on GitHub.
- SEASMP has no safely available authentic application screenshot. The portfolio uses a verified schematic instead.
- IELTS landing-page capture is authentic; its external backend's full functionality remains unverified.
- FormSubmit delivery was deliberately not exercised with a real submission.
- Private logistics source records are not published. No additional graduation date or personal facts were inferred.

No deployment or push was performed. Browser coverage here is Chromium; Safari/Firefox and live-host field metrics remain outside this verification.
