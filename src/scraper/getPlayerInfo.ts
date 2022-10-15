import { HLTV_URL } from ".";
import { createPage } from "../util/createPage";

export async function getPlayerInfo(playerId: string) {
  const [page, browser] = await createPage();

  await page.goto(`https://www.hltv.org/player/${playerId}/player`, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  const info = await page.evaluate((hltvURL) => {
    function formatImage(image: string) {
      return image.startsWith("/img/static") ? `${hltvURL}${image}` : image;
    }

    function getImageAttr(
      selector: string,
      parent: Element | Document = document
    ) {
      const element = parent.querySelector(selector);

      const title = element.getAttribute("title");
      const src = formatImage(element.getAttribute("src"));

      return {
        title,
        src,
      };
    }

    function getPictures() {
      return [...document.querySelectorAll('.gallery-grid img')].map(($img) => {
        return $img.getAttribute('src');
      });
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

    const nickname = document.querySelector("h1.playerNickname").textContent;
    const fullName = document
      .querySelector("div.playerRealname")
      .textContent.trim();
    const age = Number(
      document
        .querySelector(".playerAge .listRight")
        .textContent.match(/\d+/)[0]
    );

    const $flag = document.querySelector(".flag");
    const $teamWrapper = document.querySelector(".playerTeam .listRight");
    const $teamImage = $teamWrapper.querySelector("img");
    const $teamLink = $teamWrapper.querySelector("a");

    const social = [
      ...document.querySelectorAll(".socialMediaButtons a"),
    ].reduce((social, $element) => {
      const link = $element.getAttribute("href");

      const media = $element.querySelector("i").classList[2];

      return {
        ...social,
        [media]: link,
      };
    }, {});

    const trophies = getTrophies();
    const pictures =getPictures();

    return {
      nickname,
      full_name: fullName,
      age,
      social,
      body_shot: {
        team: getImageAttr(".playerBodyshot img"),
        player: getImageAttr(".playerBodyshot img:not(:first-child)"),
      },
      team: {
        logo: formatImage($teamImage.getAttribute("src")),
        title: $teamImage.getAttribute("title"),
        url: $teamLink.getAttribute("href").replace("/team", "/team/info"),
      },
      nationality: {
        title: $flag.getAttribute("title"),
        flag: formatImage($flag.getAttribute("src")),
      },
      trophies,
      pictures,
    };
  }, HLTV_URL);

  await browser.close();

  return info;
}
