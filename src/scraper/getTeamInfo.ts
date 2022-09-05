import { HLTV_URL } from '.';

import { createPage } from "../util/createPage";

export async function getTeamInfo(team: string) {
  const [page, browser] = await createPage();

  const teamFormatted = team.startsWith("/") ? team.replace("/", "") : team;

  await page.goto(`https://www.hltv.org/team/${teamFormatted}`, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const info = await page.evaluate(() => {
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
        (link) => {
          const image = link.querySelector("img");
          const nationality = link.querySelector("img.flag");

          const flagSrc = nationality.getAttribute("src");

          const flag = flagSrc.startsWith('http') ? flagSrc : HLTV_URL + flagSrc;

          return {
            url: link.getAttribute("href"),
            nick: link.getAttribute("title"),
            full_name: image.getAttribute("title"),

            nationality: {
              country: nationality.getAttribute("title"),
              flag,
            },

            image: {
              src: image.getAttribute("src"),
              alt: image.getAttribute("alt"),
            },
          };
        }
      );
    }

    function getNextMatch() {
      const [, enemy] = document.querySelectorAll(
        ".streak-next-match-image-ASdvuasdr123Gazx"
      );

      return {
        name: enemy.getAttribute("alt"),
        logo: enemy.getAttribute("src"),
      };
    }

    function getCurrentForm() {
      return [...document.querySelectorAll(".streak-ASdvuasdr123Gazx")]
        .map((match) => ({
          won: match.classList.contains("won"),
        }))
        .reverse();
    }

    function getTrophies() {
      return [...document.querySelectorAll("a.trophy")].map((link) => {
        const trophy = link.querySelector(".trophyDescription");

        const name = trophy.getAttribute("title");
        const url = link.getAttribute("href");
        const imageURL = trophy.querySelector("img").getAttribute("src");

        const image = imageURL.startsWith("http")
          ? imageURL
          : "https://www.hltv.org" + imageURL;

        return {
          name,
          url,
          image,
        };
      });
    }

    const country = getElementText(".team-country");
    const name = getElementText(".profile-team-name");
    const stats = getTeamStats();
    const players = getPlayers();
    const nextMatch = getNextMatch();
    const currentForm = getCurrentForm();
    const trophies = getTrophies();
    const logo = document.querySelector('.team-logo').getAttribute('src');

    return {
      players,
      country,
      name,
      next_match: nextMatch,
      current_form: currentForm,
      thropies: trophies,
      logo,
      ...stats,
    };
  });

  await browser.close();

  return info;
}
