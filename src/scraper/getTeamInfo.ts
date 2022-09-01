import { Page } from "puppeteer";

export async function getTeamInfo(page: Page, team: string) {
  const teamFormatted = team.startsWith('/') ? team.replace('/', '') : team;

  await page.goto(`https://www.hltv.org/${teamFormatted}`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  return page.evaluate(() => {
    const mappers = {
      world_ranking: (value: string) => parseInt(value.replace("#", "")),
      weeks_in_top30_for_core: parseInt,
      average_player_age: Number,
    };

    function getElementText(
      selector: string,
      parent: Element | Document = document
    ) {
      return parent.querySelector(selector).textContent.trim();
    }

    function getTeamStats() {
      const elements = [...document.querySelectorAll(".profile-team-stat")];

      return elements.reduce((stats, element) => {
        const name = getElementText("b", element)
          .toLowerCase()
          .replaceAll(" ", "_");

        const isLink = element.querySelector("a");

        const rawValue = getElementText(isLink ? "a" : "span", element);
        const mapper = mappers[name];
        const value = mapper ? mapper(rawValue) : rawValue;

        return {
          ...stats,
          [name]: value,
        };
      }, {});
    }

    function getPlayers() {
      return [...document.querySelectorAll(".bodyshot-team-bg a")].map(
        (link) => ({
          url: link.getAttribute("href"),
          name: link.getAttribute("title"),
        })
      );
    }

    function getNextMatch() {
      const [, enemy] = document.querySelectorAll(
        ".streak-next-match-image-ASdvuasdr123Gazx"
      );

      return {
        name: enemy.getAttribute('alt'),
        logo: enemy.getAttribute('src'),
      };
    }

    const country = getElementText(".team-country");
    const name = getElementText(".profile-team-name");
    const stats = getTeamStats();
    const players = getPlayers();
    const nextMatch = getNextMatch();

    return { players, country, name, nextMatch, ...stats };
  });
}
