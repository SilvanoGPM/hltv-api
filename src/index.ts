import { launch } from "puppeteer";

import Scraper from "./scraper";

const headless = process.env.HEADLESS.toLocaleLowerCase() === "true";

async function main() {
  const browser = await launch({ headless });
  const page = await browser.newPage();

  const x = await Scraper.getTeamMatches(page, '4608');

  console.log(JSON.stringify(x, null, 2));

  await browser.close();
}

main();
