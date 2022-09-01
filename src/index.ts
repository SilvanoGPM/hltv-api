import { launch } from "puppeteer";

import Scraper from "./scraper";

const headless = process.env.HEADLESS.toLocaleLowerCase() === "true";

async function main() {
  const browser = await launch({ headless });
  const page = await browser.newPage();

  const x = await Scraper.getTeamMatches(page, {
    team: "4608",
    actualPage: 1,
    startDate: '2012-01-01',
    endDate: '2012-12-31',
  });

  console.log(JSON.stringify(x, null, 2));

  await browser.close();
}

main();
