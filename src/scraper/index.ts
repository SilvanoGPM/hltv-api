import { getTeamInfo } from './getTeamInfo';
import { getTeamMatches } from './getTeamMatches';
import { getMatchInfo } from './getMatchInfo';
import { getRankingInfo } from './getRankingInfo';
import { search } from './search';

export const HLTV_URL = 'https://www.hltv.org';
export const TEAM_PLACEHOLDER_IMAGE = 'https://www.hltv.org/img/static/team/placeholder.svg';
export const PLAYER_PLACEHOLDER_IMAGE = 'https://static.hltv.org/images/playerprofile/bodyshot/unknown.png';

export const Scraper = {
  getTeamInfo,
  getTeamMatches,
  getMatchInfo,
  getRankingInfo,
  search,
  TEAM_PLACEHOLDER_IMAGE,
  PLAYER_PLACEHOLDER_IMAGE,
};

export default Scraper;
