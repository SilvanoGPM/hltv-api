import { Browser, launch, Page } from "puppeteer";

const headless = process.env.HEADLESS.toLocaleLowerCase() === "true";

type CreatePageReturn = [Page, Browser];

export async function createPage(): Promise<CreatePageReturn> {
  const browser = await launch({
    headless,
  });
  const page = await browser.newPage();

  return [page, browser];
}
