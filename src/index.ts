import { launch } from "puppeteer";

import Scraper from "./scraper";

const headless = process.env.HEADLESS.toLocaleLowerCase() === "true";

async function main() {
  const browser = await launch({ headless });
  const page = await browser.newPage();

  const teams = await Scraper.getTeamInfo(page, '/team/9455/imperial');

  console.log(teams);

  await browser.close();
}

main();
