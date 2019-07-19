const axios = require('axios');

const config = require('../config');
const serviceRegionToHostMap = require('../data/service-region-to-host-map.json');

class SummonersService {
  async getSummonerBySummonerName(serviceRegion, summonerName) {
    // Build the request for Summoner data
    const host = serviceRegionToHostMap[serviceRegion];
    const requestUrl = `${host}/lol/summoner/v4/summoners/by-name/${summonerName}`;

    // Get the Summoner data
    try {
      const summoner = await axios.get(requestUrl, {
        params: {
          'api_key': config.riotGamesApiKey
        }
      });

      // Return the Summoner data as our response body
      return summoner.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = SummonersService;
