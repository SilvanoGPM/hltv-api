import { HLTV_URL } from ".";
import { createPage } from "../util/createPage";
import { verifyError } from "../util/verifyError";

interface GetRankingInfoOptions {
  day: string | number;
  month: string;
  year: string | number;
  country?: string;
}

export async function getRankingInfo({
  day,
  month,
  year,
  country,
}: GetRankingInfoOptions) {
  const [page, browser] = await createPage();

  const path = `${year}/${month}/${day}${
    country && country !== "undefined" ? `/country/${country}` : ""
  }`;

  await page.goto(`https://www.hltv.org/ranking/teams/${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  await verifyError(page, browser);

  const navigation = await page.evaluate(() => {
    function getNavigation(prevSelector: string, nextSelector: string) {
      return [prevSelector, nextSelector].map((selector) => {
        const href = document.querySelector(selector).getAttribute("href");

        if (href) {
          return href.replace("/teams", "");
        }

        return null;
      });
    }

    const [prev, next] = getNavigation(
      "a.pagination-prev",
      "a.pagination-next"
    );

    return { prev, next };
  });

  const teams = await page.evaluate((hltvURL) => {
    return [...document.querySelectorAll(".ranked-team")].map(($team) => {
      const actualPosition = Number(
        $team.querySelector(".position").textContent.replace("#", "")
      );

      const name = $team.querySelector(".name").textContent;

      const points = Number(
        $team
          .querySelector(".points")
          .textContent.replaceAll(/\(|\)|points?/gi, "")
      );

      const changeText = $team.querySelector(".change").textContent;
      const changePosition = changeText === "-" ? 0 : Number(changeText);

      const link = $team
        .querySelector(".moreLink")
        .getAttribute("href")
        .replace("/team", "/team/info");

      const players = [...$team.querySelectorAll(".lineup a")].map(
        ($player) => {
          const $image = $player.querySelector("img");

          const fullName = $image.getAttribute("alt");
          const imageSrc = $image.getAttribute("src");

          const image = imageSrc.startsWith("/img/static")
            ? `${hltvURL}${imageSrc}`
            : imageSrc;

          const $nick = $player.querySelector(".nick");

          const nick = $nick.textContent;

          const $nationalityImage = $nick.querySelector("img");
          const flag = $nationalityImage.getAttribute("src");

          const nationality = {
            name: $nationalityImage.getAttribute("alt"),
            flag: flag.startsWith("/img/static") ? `${hltvURL}${flag}` : flag,
          };

          return { full_name: fullName, nick, image, nationality };
        }
      );

      return {
        position: {
          actual: actualPosition,
          change: changePosition,
        },
        name,
        link,
        points,
        players,
      };
    });
  }, HLTV_URL);

  await browser.close();

  return { teams, navigation };
}
