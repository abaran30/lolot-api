const expect = require('chai').expect;
const nock = require('nock');

const config = require('../config');
const mockSummoner = require('./mocks/mock-summoner.json');
const mock404Error = require('./mocks/mock-404-error.json');
const serviceRegionToHostMap = require('../data/service-region-to-host-map.json');
const SummonersService = require('../utility-services/summoners.service');

const host = serviceRegionToHostMap['NA'];
const endpoint = '/lol/summoner/v4/summoners';

describe('\"Summoners\" utility service', () => {
  it('should handle 200 response from the Summoner endpoint when getting a Summoner by name', async () => {
    nock(host)
      .get(`${endpoint}/by-name/MockSummoner200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockSummoner);

    const summonersService = new SummonersService();
    const summonerResponse = await summonersService.getSummonerBySummonerName('NA', 'MockSummoner200');

    expect(summonerResponse.profileIconId).to.equal(2098);
    expect(summonerResponse.name).to.equal('MockSummoner200');
    expect(summonerResponse.puuid).to.equal('mock-puuid-200');
    expect(summonerResponse.summonerLevel).to.equal(100);
    expect(summonerResponse.revisionDate).to.equal(1563157688000);
    expect(summonerResponse.id).to.equal('mock-id-200');
    expect(summonerResponse.accountId).to.equal('mock-accountId-200');
  });

  it('should handle 404 response from the Summoner endpoint when getting a Summoner by name', async () => {
    nock(host)
      .get(`${endpoint}/by-name/MockSummoner404?api_key=${config.riotGamesApiKey}`)
      .reply(404, mock404Error);

    const summonersService = new SummonersService();

    try {
      await summonersService.getSummonerBySummonerName('NA', 'MockSummoner404');
    } catch (error) {
      expect(error.response.data.status.status_code).to.equal(404);
      expect(error.response.data.status.message).to.equal('Data not found');
    }
  });
});
