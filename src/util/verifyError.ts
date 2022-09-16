import { Browser, Page } from 'puppeteer';

import { HLTVError } from '../error/HLTVError';

export async function verifyError(page: Page, browser: Browser) {
  const error = await page.evaluate(() => {
    const errorElement = document.querySelector('.error-status');

    if (!errorElement) {
      return null;
    }

    const status = Number(errorElement.querySelector('h1').textContent);
    const message = errorElement.querySelector('.error-desc').textContent;

    return { status, message };
  });

  if (error) {
    throw new HLTVError(error.status, error.message);
  }
}
