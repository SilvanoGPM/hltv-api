import qs from "query-string";
import { createPage } from "../util/createPage";

type Maps =
  | "de_cache"
  | "de_season"
  | "de_dust2"
  | "de_mirage"
  | "de_inferno"
  | "de_nuke"
  | "de_train"
  | "de_cobblestone"
  | "de_overpass"
  | "de_tuscan"
  | "de_vertigo"
  | "de_ancient";

interface GetTeamMatchesOptions {
  /**
   * HLTV TeamId
   *
   * Example (Navi Team): 4608 */
  team: string;

  /**
   * DateFormat: yyyy-MM-dd.
   *
   * Example: 2022-09-01 */
  startDate?: string;

  /**
   * DateFormat: yyyy-MM-dd.
   *
   * Example: 2022-09-01 */
  endDate?: string;

  stars?: number;
  map?: Maps;

  /**
   * One based pagination, only positive values. */
  actualPage?: number;
}

export async function getTeamMatches({
  actualPage = 1,
  ...options
}: GetTeamMatchesOptions) {
  const [page, browser] = await createPage();

  const offset = (actualPage - 1) * 100;

  const params = qs.stringify({ ...options, offset });

  await page.goto(`https://www.hltv.org/results?${params}`, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const matches = await page.evaluate((page) => {
    const selector =
      page === 1 ? ".result-con:not(:first-child)" : ".result-con";

    return [...document.querySelectorAll(selector)].map((match) => {
      const link = match.querySelector(".a-reset").getAttribute("href");

      const [team, enemy] = match.querySelectorAll(".team-cell");

      const mainTeam = team.querySelector(".team");
      const enemyTeam = enemy.querySelector(".team");

      const mainTeamWon = mainTeam.classList.contains("team-won");

      const [teamScore, enemyScore] =
        match.querySelectorAll(".result-score span");

      const event = match.querySelector(".event-logo");
      const stars = match.querySelector(".stars");

      const mapText = match.querySelector(".map-text").textContent;

      const bestOf = mapText.startsWith("bo") ? Number(mapText[2]) : 1;

      return {
        link,
        best_of: bestOf,
        stars: stars?.children?.length || 0,

        team: {
          name: mainTeam.textContent,
          logo: team.querySelector("img").getAttribute("src"),
          score: Number(teamScore.textContent),
          won: mainTeamWon,
        },

        enemy: {
          name: enemyTeam.textContent,
          logo: enemy.querySelector("img").getAttribute("src"),
          score: Number(enemyScore.textContent),
          won: !mainTeamWon,
        },

        event: {
          title: event.getAttribute("title"),
          src: event.getAttribute("src"),
        },
      };
    });
  }, actualPage);

  const pagination = await page.evaluate(() => {
    const paginationElement = document.querySelector(".pagination-data");

    const [actual, max, total] = paginationElement
      ? paginationElement.textContent
          .match(/(\d+) - (\d+) of (\d+)/)
          .splice(1)
          .map(Number)
      : [0, 0, 0];

    return {
      actual,
      max,
      total,
    };
  });

  await browser.close();

  return { matches, pagination };
}
