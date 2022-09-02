import { createPage } from "../util/createPage";

import { TEAM_PLACEHOLDER_IMAGE } from ".";

export async function searchTeams(teamName: string) {
  const [page] = await createPage();

  await page.goto(`https://www.hltv.org/search?query=${teamName}`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  const teams = await page.evaluate((placeholder) => {
    const EMPTY_LOGO = "/img/static/team/placeholder.svg";

    const teamsRows = document
      .querySelector("tbody")
      .querySelectorAll("tr:not(:first-child) a");

    console.log('request');

    return [...teamsRows].map((row) => {
      const pattern = /\/team\/(\d+)\/(\w+)/;
      const url = row.getAttribute("href").replace('/team', '/team/info');

      const [_, id, slug] = url.match(pattern) || [];

      const name = row.textContent;
      const logo = row.querySelector("img").getAttribute("src");

      return {
        url,
        id,
        slug,
        name,
        logo: logo === EMPTY_LOGO ? placeholder : logo,
      };
    });
  }, TEAM_PLACEHOLDER_IMAGE);

  await page.close();

  return teams;
}
