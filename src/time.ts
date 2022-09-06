import Scraper from './scraper';

async function main() {
  console.time('teams');

  const info = await Scraper.getTeamInfo('/9455/imperial');

  console.log(JSON.stringify(info, null, 2));

  console.timeEnd('teams');
}

main();
