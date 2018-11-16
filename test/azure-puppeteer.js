const puppeteer = require("puppeteer");
const url = process.env.AZURE_SITE_URL;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const dashboardDiv = await page.$("div#dashboard");
  await browser.close();
  if (dashboardDiv === null) {
    console.error(
      "no dashboard div element found! App probably didn't boot correctly."
    );
    process.exit(1);
  } else {
    console.log("found dashboard div element. App probably booted fine.");
    process.exit();
  }
})();
