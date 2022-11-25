const axios = require('axios');

const config = require('../../config');
const keyToChampionMap = require('../../data/key-to-champion-map.json');
const serviceRegionToHostMap = require('../../data/service-region-to-host-map.json');
const ErrorHandlerService = require('../../utility-services/error-handler.service');
const SummonersService = require('../../utility-services/summoners.service');

class ChampionMasteriesService {
  // GET "champion-masteries"
  async find(params) {
    // Extract the service region and Summoner name from the query params
    const serviceRegion = params.query.serviceRegion;
    const summonerName = params.query.summonerName;

    try {
      // We need the Summoner ID, and we only have the Summoner name from the query params
      // Use the Summoners utility service to get the Summoner data, including the encrypted ID
      const summonersService = new SummonersService();
      const summoner = await summonersService.getSummonerBySummonerName(serviceRegion, summonerName);
      const encryptedSummonerId = summoner['id'];

      // Build the request for Champion Mastery data
      const host = serviceRegionToHostMap[params.query.serviceRegion];
      const requestUrl = `${host}/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedSummonerId}`;

      // Get the Champion Mastery data
      const championMasteries = await axios.get(requestUrl, {
        params: {
          'api_key': config.riotGamesApiKey
        }
      });

      // Fetch the latest Data Dragon version and the build Data Dragon URL
      const dDragonVersions = await axios.get(`${config.riotDDragonBaseUrl}/api/versions.json`);
      const dDragonUrl = `${config.riotDDragonBaseUrl}/cdn/${dDragonVersions.data[0]}`;

      // For each Champion Mastery entry, attach the Champion name using the static map of Champion IDs to Champion names
      // We also want to attach the square asset URL so that the UI has it readily available
      // Furthermore, remove the "summonerId" attribute
      championMasteries.data = championMasteries.data.map(championMastery => {
        const championMapping = keyToChampionMap[championMastery['championId']];
        championMastery.championId = championMapping.id;
        championMastery.championName = championMapping.name;
        championMastery.championSquareAssetUrl =
          `${dDragonUrl}/img/champion/${championMastery.championId}.png`;
        delete championMastery.summonerId;
        return championMastery;
      });

      // We want to respond with the relevant Summoner data and decorated Champion Mastery data
      // First, let's add the Summoner's profile icon URL so that the UI has it readily available
      summoner.profileIconUrl = `${dDragonUrl}/img/profileicon/${summoner.profileIconId}.png`;

      // Then, let's remove the unnecessary Summoner attributes
      delete summoner.id;
      delete summoner.accountId;
      delete summoner.puuid;

      // Build and return our response body
      const responseBody = {
        summoner: summoner,
        championMasteries: championMasteries.data
      };

      return responseBody;
    } catch (error) {
      const errorStatus = error.response.data.status;
      new ErrorHandlerService().handleError(errorStatus.status_code, errorStatus.message);
    }
  }
}

module.exports = ChampionMasteriesService;
