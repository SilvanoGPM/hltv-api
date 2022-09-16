import Scraper from './scraper';

async function main() {
  const rankings = await Scraper.getRankingInfo({
    day: 5,
    month: 'september',
    year: 2022,
  });

  console.log(JSON.stringify(rankings, null, 2));
}

main();
