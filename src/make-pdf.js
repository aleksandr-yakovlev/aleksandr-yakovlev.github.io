const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/cv.html", {
    waitUntil: "networkidle2",
  });
  await page.evaluateHandle("document.fonts.ready");
  await page.emulateMediaType("screen");
  await page.pdf({
    path: "./cv.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();
})();
