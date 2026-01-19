from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto(f"file://{os.getcwd()}/verification/feed.html")
    page.screenshot(path="verification/screenshot.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
