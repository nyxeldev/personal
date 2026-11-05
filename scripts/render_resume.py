"""Regenerate the r?sum? from its editable HTML source; requires Playwright Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto((ROOT / "resume/Resume.html").as_uri())
        page.pdf(path=str(ROOT / "public/files/Resume.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
        browser.close()
    print("Generated public/files/Resume.pdf from resume/Resume.html")

if __name__ == "__main__":
    main()
