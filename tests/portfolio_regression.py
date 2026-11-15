"""Behavioral checks against a fresh static export. Never sends real messages.

Run `npm run build` first, then `python tests/portfolio_regression.py`.
Requires Python Playwright with Chromium. Screenshots/lab data go to artifacts/.
"""
import functools
import http.server
import json
from pathlib import Path
import threading
import unittest
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "artifacts"


class StaticHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            content = (ROOT / "out/404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            super().send_error(code, message, explain)


class Portfolio(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not (ROOT / "out/index.html").exists():
            raise RuntimeError("Run npm run build before these checks")
        ARTIFACTS.mkdir(exist_ok=True)
        cls.server = http.server.ThreadingHTTPServer(
            ("127.0.0.1", 0), functools.partial(StaticHandler, directory=str(ROOT / "out"))
        )
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 900})
        self.context.route("https://formsubmit.co/**", lambda route: route.abort())
        self.context.route("https://api.github.com/**", lambda route: route.abort())
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(self.url, wait_until="networkidle")

    def tearDown(self):
        self.assertEqual(self.errors, [], "Unexpected browser errors")
        self.context.close()

    def test_01_responsive_hierarchy_and_visuals(self):
        for width in [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]:
            with self.subTest(width=width):
                self.page.set_viewport_size({"width": width, "height": 900})
                self.page.evaluate("scrollTo(0,0)")
                self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), width)
                for element in self.page.locator("h1,h2,h3,h4,.hero__cta .btn").all():
                    box = element.bounding_box()
                    if box:
                        self.assertGreaterEqual(box["x"], -1)
                        self.assertLessEqual(box["x"] + box["width"], width + 1)
                if width <= 960:
                    expect(self.page.locator(".hero__viz")).not_to_be_visible()
                    cta = self.page.locator(".hero__cta").bounding_box()
                    self.assertLess(cta["y"] + cta["height"], 900)
                self.page.screenshot(path=str(ARTIFACTS / f"hero-{width}.png"))
        self.page.set_viewport_size({"width": 390, "height": 667})
        cta = self.page.locator(".hero__cta").bounding_box()
        self.assertLess(cta["y"] + cta["height"], 667)
        self.page.screenshot(path=str(ARTIFACTS / "hero-short.png"))
        self.page.set_viewport_size({"width": 1440, "height": 1000})
        for section in ["work", "data", "decisions", "build", "experience", "about", "contact"]:
            self.page.locator(f"#{section}").evaluate("e=>e.scrollIntoView({behavior:'instant'})")
            self.page.screenshot(path=str(ARTIFACTS / f"section-{section}.png"))

    def test_02_mobile_menu_and_keyboard(self):
        for width, height in [(390, 667), (844, 390)]:
            self.page.set_viewport_size({"width": width, "height": height})
            opener = self.page.get_by_role("button", name="Open menu", exact=True)
            opener.click()
            dialog = self.page.get_by_role("dialog", name="Explore the portfolio")
            expect(dialog).to_be_visible()
            self.assertEqual(self.page.evaluate("document.body.style.overflow"), "hidden")
            resume = dialog.get_by_role("link", name="View résumé")
            resume.focus()
            self.page.keyboard.press("Tab")
            expect(dialog.get_by_role("link", name="Email me")).to_be_focused()
            for _ in range(4):
                self.page.keyboard.press("Tab")
            expect(dialog.get_by_role("button", name="Close menu")).to_be_focused()
            self.page.keyboard.press("Escape")
            expect(dialog).not_to_be_visible()
            expect(opener).to_be_focused()
            self.assertEqual(self.page.evaluate("document.body.style.overflow"), "")
        opener.click()
        self.page.get_by_role("dialog").get_by_role("link", name="Work", exact=True).click()
        expect(self.page.locator("#work")).to_be_focused()

    def test_03_palette_selection_and_restore(self):
        opener = self.page.get_by_role("button", name="Open command centre")
        opener.click()
        search = self.page.get_by_role("combobox", name="Search commands")
        expect(search).to_be_focused()
        first = search.get_attribute("aria-activedescendant")
        self.page.keyboard.press("ArrowDown")
        self.assertNotEqual(search.get_attribute("aria-activedescendant"), first)
        expect(search).to_be_focused()
        active = search.get_attribute("aria-activedescendant")
        self.assertEqual(self.page.locator(f"#{active}").get_attribute("aria-selected"), "true")
        search.fill("nothing-matches-this")
        expect(self.page.get_by_role("status")).to_have_text("No matching commands.")
        self.assertIsNone(search.get_attribute("aria-activedescendant"))
        self.page.keyboard.press("Tab")
        expect(self.page.get_by_role("button", name="Close command centre")).to_be_focused()
        self.page.keyboard.press("Escape")
        expect(opener).to_be_focused()
        self.page.keyboard.press("Control+k")
        search.fill("logistics")
        self.page.keyboard.press("Enter")
        expect(self.page.locator("#data")).to_be_focused()
        self.assertEqual(self.page.evaluate("document.body.style.overflow"), "")

    def test_04_reduced_motion(self):
        self.page.emulate_media(reduced_motion="reduce")
        self.assertEqual(self.page.locator("html").evaluate("e=>getComputedStyle(e).scrollBehavior"), "auto")
        self.assertEqual(self.page.locator(".hero__dot").evaluate("e=>getComputedStyle(e).animationName"), "none")

    def test_05_contact_validation_failure_success(self):
        self.page.locator("#contact").scroll_into_view_if_needed()
        send = self.page.get_by_role("button", name="Send message")
        send.click()
        expect(self.page.get_by_label("Name", exact=True)).to_be_focused()
        self.assertEqual(self.page.get_by_label("Name", exact=True).get_attribute("aria-describedby"), "error-name")
        self.page.get_by_label("Name", exact=True).fill("Audit test")
        self.page.get_by_label("Email", exact=True).fill("audit@example.com")
        self.page.get_by_label("Message", exact=True).fill("Intercepted regression check, never delivered.")
        send.click()
        expect(self.page.locator(".cform [role=alert]")).to_contain_text("Could not send")
        expect(self.page.get_by_label("Message", exact=True)).to_have_value("Intercepted regression check, never delivered.")
        href = self.page.get_by_role("link", name="Open your message in your email app").get_attribute("href")
        self.assertIn("body=", href)
        self.context.route("https://formsubmit.co/**", lambda r: r.fulfill(status=200, content_type="application/json", body='{"success":true}'))
        send.click()
        expect(self.page.get_by_role("status")).to_contain_text("accepted")
        expect(self.page.get_by_label("Message", exact=True)).to_have_value("")

    def test_06_no_javascript_metadata_assets_and_404(self):
        context = self.browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 667})
        page = context.new_page()
        page.goto(self.url)
        expect(page.get_by_role("heading", name="NYXELDEV", exact=True)).to_be_visible()
        expect(page.locator(".hero__lead")).to_be_visible()
        self.assertEqual(page.locator(".hero__lead").evaluate("e=>getComputedStyle(e).opacity"), "1")
        expect(page.locator("#seasmp-model")).to_be_visible()
        self.assertEqual(page.locator("link[rel=canonical]").get_attribute("href"), "https://nyxeldev.pro")
        self.assertEqual(page.locator("html").get_attribute("lang"), "en")
        for href in page.locator("a[href^='#']").evaluate_all("els=>els.map(e=>e.getAttribute('href'))"):
            self.assertEqual(page.locator(href).count(), 1, href)
        expect(page.get_by_role("link", name="Email me", exact=True)).to_be_visible()
        expect(page.get_by_role("button", name="Send message")).to_be_disabled()
        response = page.request.get(self.url + "/files/Resume.pdf")
        self.assertEqual(response.status, 200)
        self.assertTrue(response.body().startswith(b"%PDF"))
        for path in ["/robots.txt", "/sitemap.xml", "/images/og.png", "/images/favicon.ico", "/images/ielts-640.webp"]:
            self.assertEqual(page.request.get(self.url + path).status, 200)
        response = page.goto(self.url + "/missing-page")
        self.assertEqual(response.status, 404)
        expect(page.get_by_role("heading", name="This page could not be found.")).to_be_visible()
        robots = page.locator("meta[name=robots]").evaluate_all("els=>els.map(e=>e.content)")
        self.assertTrue(robots and all("noindex" in value for value in robots))
        context.close()

    def test_07_optional_github_partial_results_and_cache(self):
        calls = []
        def github(route):
            calls.append(route.request.url)
            if route.request.url.endswith("/events/public"):
                route.abort()
            else:
                route.fulfill(status=200, content_type="application/json", body='{"public_repos":17}')
        self.context.route("https://api.github.com/**", github)
        self.page.locator("footer").scroll_into_view_if_needed()
        expect(self.page.locator(".buildlog")).to_contain_text("17 public repos")
        self.assertEqual(len(calls), 2)
        self.page.reload(wait_until="networkidle")
        self.page.locator("footer").scroll_into_view_if_needed()
        expect(self.page.locator(".buildlog")).to_contain_text("17 public repos")
        self.assertEqual(len(calls), 2)

    def test_08_structure_and_local_lab_measurements(self):
        self.assertEqual(self.page.locator("h1").count(), 1)
        self.assertEqual(self.page.locator("main").count(), 1)
        self.assertEqual(self.page.locator("[role=tab]").count(), 0)
        ids = self.page.locator("[id]").evaluate_all("els=>els.map(e=>e.id)")
        self.assertEqual(len(ids), len(set(ids)))
        for control in self.page.locator("input:not([tabindex='-1']),textarea").all():
            self.assertTrue(control.get_attribute("aria-label") or self.page.locator(f"label[for='{control.get_attribute('id')}']").count())
        self.assertTrue(self.page.get_by_role("link", name="Download PDF").get_attribute("download"))
        metrics = self.page.evaluate("""({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})),resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transferSize:r.transferSize,encodedBodySize:r.encodedBodySize}))})""")
        (ARTIFACTS / "local-lab.json").write_text(json.dumps(metrics, indent=2), encoding="utf8")

    def test_09_tall_cards_and_failed_hydration_remain_readable(self):
        for width, height in [(320, 568), (390, 667), (844, 390)]:
            with self.subTest(viewport=(width, height)):
                self.page.set_viewport_size({"width": width, "height": height})
                self.page.reload(wait_until="networkidle")
                for selector in ["#seasmp", "#ielts", ".datastory__out", ".cform"]:
                    element = self.page.locator(selector)
                    element.evaluate("e=>e.scrollIntoView({behavior:'instant',block:'start'})")
                    expect(element).to_have_class(__import__("re").compile("is-in"))
                    self.assertIn("0.7s", element.evaluate("e=>getComputedStyle(e).transitionDuration"))
                    self.page.wait_for_timeout(1100)
                    self.assertEqual(element.evaluate("e=>getComputedStyle(e).opacity"), "1", selector)
                self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), width)
        context = self.browser.new_context()
        context.route("**/_next/static/**/*.js", lambda route: route.abort())
        page = context.new_page()
        page.goto(self.url, wait_until="networkidle")
        for selector in [".hero__lead", "#seasmp", ".cform"]:
            self.assertEqual(page.locator(selector).evaluate("e=>getComputedStyle(e).opacity"), "1")
        self.assertEqual(page.locator(".hero__name .split__word").first.evaluate("e=>getComputedStyle(e).transform"), "none")
        context.close()

    def test_10_architecture_and_project_disclosure(self):
        analytics = self.page.locator(".sysdia__controls").get_by_role("button", name="FASTAPI", exact=True)
        analytics.focus()
        self.page.keyboard.press("Enter")
        expect(analytics).to_have_attribute("aria-pressed", "true")
        expect(self.page.locator("#architecture-note")).to_contain_text("Analytics service")
        disclosure = self.page.locator(".next")
        disclosure.locator("summary").click()
        expect(disclosure).to_have_attribute("open", "")
        expect(disclosure).to_contain_text("191 enrollments")
        disclosure.locator("summary").focus()
        self.page.keyboard.press("Enter")
        self.assertIsNone(disclosure.get_attribute("open"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
