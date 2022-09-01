import { Page } from "puppeteer";

export async function searchTeams(page: Page, teamName: string) {
  await page.goto(`https://www.hltv.org/search?query=${teamName}`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  return page.evaluate(() => {
    const EMPTY_LOGO = "/img/static/team/placeholder.svg";

    const teamsRows = document
      .querySelector("tbody")
      .querySelectorAll("tr:not(:first-child) a");

    return Array.from(teamsRows).map((row) => {
      const pattern = /\/team\/(\d+)\/(\w+)/;
      const url = row.getAttribute("href");

      const [_, id, slug] = url.match(pattern) || [];

      const name = row.textContent;
      const logo = row.querySelector("img").getAttribute("src");

      return {
        url,
        id,
        slug,
        name,
        logo: logo === EMPTY_LOGO ? null : logo,
      };
    });
  });
}
