import { Page } from "puppeteer";

export async function getTeamMatches(page: Page, teamId: string) {
  await page.goto(`https://www.hltv.org/results?team=${teamId}`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  return page.evaluate(() => {
    return [...document.querySelectorAll(".result-con")].map((match) => {
      const link = match.querySelector('.a-reset').getAttribute('href');

      const [team, enemy] = match.querySelectorAll(".team-cell");

      const mainTeam = team.querySelector(".team");
      const enemyTeam = enemy.querySelector(".team");

      const mainTeamWon = mainTeam.classList.contains("team-won");

      const [teamScore, enemyScore] =
        match.querySelectorAll(".result-score span");

      const event = match.querySelector(".event-logo");
      const stars = match.querySelector(".stars");

      const mapText = match.querySelector(".map").textContent;

      const bestOf = mapText.startsWith("bo") ? Number(mapText[2]) : 1;

      return {
        link,
        best_of: bestOf,
        stars: stars.children.length,

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
  });
}
