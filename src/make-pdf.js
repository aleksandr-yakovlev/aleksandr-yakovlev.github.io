const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://aleksandr-yakovlev.github.io/cv.html", {
    waitUntil: "networkidle2",
  });
  await page.pdf({ path: "./src/cv.pdf", scale: 0.69, printBackground: true });

  await browser.close();
})();
