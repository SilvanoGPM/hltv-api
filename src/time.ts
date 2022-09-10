import Scraper from './scraper';

async function main() {
  console.time('teams');

  const info = await Scraper.getMatchInfo('2357710');

  console.log(JSON.stringify(info, null, 2));

  console.timeEnd('teams');
}

main();
