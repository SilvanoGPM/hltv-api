import { Page } from "puppeteer";
import qs from "query-string";

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
  team: string;
  startDate?: string;
  endDate?: string;
  stars?: number;
  map?: Maps;
  actualPage?: number;
}

export async function getTeamMatches(
  page: Page,
  { actualPage = 1, ...options }: GetTeamMatchesOptions
) {
  const offset = (actualPage - 1) * 100;

  const params = qs.stringify({ ...options, offset });

  await page.goto(`https://www.hltv.org/results?${params}`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  return page.evaluate((page) => {
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

      const paginationElement = document.querySelector(".pagination-data");

      const [actual, max, total] = paginationElement
        ? paginationElement.textContent
            .match(/(\d+) - (\d+) of (\d+)/)
            .splice(1)
            .map(Number)
        : [0, 0, 0];

      const pagination = {
        actual,
        max,
        total,
      };

      return {
        link,
        best_of: bestOf,
        stars: stars?.children?.length || 0,
        pagination,

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
}