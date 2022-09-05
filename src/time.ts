import Scraper from './scraper';

async function main() {
  console.time('teams');

  const search = await Scraper.search('Navi');

  console.log(JSON.stringify(search.event, null, 2));

  console.timeEnd('teams');
}

main();
