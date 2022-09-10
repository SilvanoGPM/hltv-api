import { HLTV_URL } from ".";
import { createPage } from "../util/createPage";

export async function getMatchInfo(id: string) {
  const [page, browser] = await createPage();

  await page.goto(`${HLTV_URL}/matches/${id}/match`, {
    timeout: 0,
    waitUntil: "domcontentloaded",
  });

  const match = await page.evaluate((hltvURL) => {
    function getElementDateString(element: Element) {
      return new Date(
        Number(element.getAttribute("data-unix"))
      ).toLocaleString();
    }

    function formatImage(image: string) {
      return image.startsWith("/img/static") ? `${hltvURL}${image}` : image;
    }

    function getImageAttr(selector: string, parent: Element) {
      const element = parent.querySelector(selector);

      const title = element.getAttribute("title");
      const src = formatImage(element.getAttribute("src"));

      return {
        title,
        src,
      };
    }

    const date = getElementDateString(
      document.querySelector(".time[data-unix]")
    );

    const countdownElement = document.querySelector(".countdown");

    const matchOver =
      countdownElement.textContent.toLowerCase() === "match over";

    const eventElement = document.querySelector(".event a");

    const picksLog = [...document.querySelectorAll(".veto-box")].map((x) =>
      x.textContent
        .trim()
        .split("\n")
        .map((y) => y.trim())
    );

    const picksMap = [...document.querySelectorAll('.mapholder')].map((element) => {
      const mapInfo = getImageAttr('img.minimap', element);

      const linkElement = element.querySelector('a.results-stats');

      return {
        name: mapInfo.title,
        image: mapInfo.src,
        statsLink: linkElement?.getAttribute('href') || null,
      };
    });

    const teams = [...document.querySelectorAll(".teamsBox .team")].map(
      (element) => {
        const url = element
          .querySelector("a")
          .getAttribute("href")
          .replace("/team", "/team/info");

        const nationalityAttr = getImageAttr("img", element);
        const imageAttr = getImageAttr("a img", element);

        const scoreElement = element.querySelector(
          ".teamsBox .team div div:not(.teamName)"
        );

        const score = Number(scoreElement?.textContent || 0);
        const win = scoreElement?.classList.contains("won") || false;

        return {
          name: imageAttr.title,
          logo: imageAttr.src,
          url,
          win,
          score,
          nationality: {
            title: nationalityAttr.title,
            flag: nationalityAttr.src,
          },
        };
      }
    );

    return {
      teams,
      date,
      matchOver,
      event: {
        name: eventElement.getAttribute("title"),
        link: eventElement.getAttribute("href"),
      },
      picks: {
        logs: picksLog,
        maps: picksMap,
      },
    };
  }, HLTV_URL);

  await browser.close();

  return match;
}
