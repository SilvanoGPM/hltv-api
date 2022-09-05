import Scraper from './scraper';

async function main() {
  console.time('teams');

  const teams = await Scraper.searchTeams('Imperial');

  console.log(JSON.stringify(teams, null, 2));

  console.timeEnd('teams');
}

main();
