import Scraper from './scraper';

async function main() {
  const rankings = await Scraper.getPlayerInfo('10566');

  console.log(JSON.stringify(rankings, null, 2));
}

main();
