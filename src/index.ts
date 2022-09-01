import { launch } from "puppeteer";

import Scraper from "./scraper";

const headless = process.env.HEADLESS.toLocaleLowerCase() === "true";

async function main() {
  const browser = await launch({ headless });
  const page = await browser.newPage();

  const teams = await Scraper.getTeamInfo(page, '/team/4608/natus-vincere');

  console.log(JSON.stringify(teams, null, 2));

  await browser.close();
}

main();
