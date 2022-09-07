import { HLTV_URL } from ".";
import { createPage } from "../util/createPage";

interface Topic {
  url: string;
  id: string;
  slug: string;
  name: string;
  logo: string;
}

interface Search {
  players: Topic[];
  articles: Topic[];
  teams: Topic[];
  events: Topic[];
}

export async function search(query: string) {
  const [page, browser] = await createPage();

  await page.goto(`https://www.hltv.org/search?query=${query}`, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const searchFound = await page.evaluate((hltvURL) => {
    const STATIC_IMAGE = "/img/static";

    const topics = [...document.querySelectorAll("table")];

    return topics.reduce<Search>(
      (search, topic) => {
        const title = topic
          .querySelector(".table-header")
          .textContent.toLowerCase() + 's';

        const rows = topic
          .querySelector("tbody")
          .querySelectorAll("tr td:not(.text-center) a");

        const value = [...rows].map((row) => {
          const pattern = /\/\w+\/(\d+)\/(\w+)/;

          const url = row
            .getAttribute("href")
            .replace("/team", "/team/info")
            .replace("/player", "/player/info")
            .replace("/events", "/event/info");

          const [_, id, slug] = url.match(pattern) || [];

          const name = row.textContent;
          const logo = row.querySelector("img")?.getAttribute("src") || "";

          return {
            url,
            id,
            slug,
            name,
            logo: logo.startsWith(STATIC_IMAGE) ? `${hltvURL}${logo}` : logo,
          };
        });

        if (search[title]) {
          return { ...search, [title]: [...search[title], ...value] };
        }

        return { ...search };
      },
      { players: [], teams: [], articles: [], events: [] }
    );
  }, HLTV_URL);

  Object.keys(searchFound);

  await browser.close();

  return searchFound;
}
