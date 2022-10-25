import Scraper from './scraper';

async function main() {
  const rankings = await Scraper.getTeamInfo('9455');

  console.log(JSON.stringify(rankings, null, 2));
}

main();
