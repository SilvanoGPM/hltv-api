import { Browser, launch, Page } from "puppeteer";
import { HEADLESS } from "../service/env";

const headless = HEADLESS.toLocaleLowerCase() === "true";

type CreatePageReturn = [Page, Browser];

export async function createPage(): Promise<CreatePageReturn> {
  const browser = await launch({
    headless,
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (
      ["image", "stylesheet", "font", "script"].indexOf(
        request.resourceType()
      ) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return [page, browser];
}
