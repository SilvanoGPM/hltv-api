import { getTeamInfo } from './getTeamInfo';
import { getTeamMatches } from './getTeamMatches';
import { searchTeams } from './searchTeams';

export const TEAM_PLACEHOLDER_IMAGE = 'https://www.hltv.org/img/static/team/placeholder.svg';
export const PLAYER_PLACEHOLDER_IMAGE = 'https://static.hltv.org/images/playerprofile/bodyshot/unknown.png';

export const Scraper = {
  getTeamInfo,
  getTeamMatches,
  searchTeams,
  TEAM_PLACEHOLDER_IMAGE,
  PLAYER_PLACEHOLDER_IMAGE,
};

export default Scraper;
