import { Browser, launch, Page } from "puppeteer";
import { HEADLESS } from '../service/env';

const headless = HEADLESS.toLocaleLowerCase() === "true";

type CreatePageReturn = [Page, Browser];

export async function createPage(): Promise<CreatePageReturn> {
  const browser = await launch({
    headless,
  });
  const page = await browser.newPage();

  return [page, browser];
}
