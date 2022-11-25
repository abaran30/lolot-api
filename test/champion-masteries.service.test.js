const expect = require('chai').expect;
const nock = require('nock');

const config = require('../config');
const mockChampions = require('./mocks/mock-champions.json');
const mockChampionMasteries = require('./mocks/mock-champion-masteries.json');
const mockSummoner = require('./mocks/mock-summoner.json');
const mock404Error = require('./mocks/mock-404-error.json');
const serviceRegionToHostMap = require('../data/service-region-to-host-map.json');
const ChampionMasteriesService = require('../services/champion-masteries/champion-masteries.service');

const host = serviceRegionToHostMap['NA'];
const summonersEndpoint = '/lol/summoner/v4/summoners';
const championMasteriesEndpoint = '/lol/champion-mastery/v4/champion-masteries/by-summoner';

describe('\"Champion Masteries\" service', () => {
  it('should handle 200 response from the Summoner and Champion Mastery endpoints when performing a GET for Champion Masteries',
    async () => {
      nock(host)
        .get(`${summonersEndpoint}/by-name/MockSummoner200?api_key=${config.riotGamesApiKey}`)
        .reply(200, mockSummoner);
      nock(host)
        .get(`${championMasteriesEndpoint}/mock-id-200?api_key=${config.riotGamesApiKey}`)
        .reply(200, mockChampionMasteries);
      nock(config.riotDDragonBaseUrl)
        .get('/api/versions.json')
        .reply(200, ['12.22.1']);
      nock(config.riotDDragonBaseUrl)
        .get('/cdn/12.22.1/data/en_US/champion.json')
        .reply(200, mockChampions);

      const params = {
        query: {
          serviceRegion: 'NA',
          summonerName: 'MockSummoner200'
        }
      };
      const championsMasteriesService = new ChampionMasteriesService();
      const championMasteriesResponse = await championsMasteriesService.find(params);

      const summoner = championMasteriesResponse.summoner;

      expect(summoner.profileIconId).to.equal(2098);
      expect(summoner.name).to.equal('MockSummoner200');
      expect(summoner.summonerLevel).to.equal(100);
      expect(summoner.revisionDate).to.equal(1563157688000);
      expect(summoner.profileIconUrl).to.equal(`${config.riotDDragonBaseUrl}/cdn/12.22.1/img/profileicon/2098.png`);

      const championMasteries = championMasteriesResponse.championMasteries;

      expect(championMasteries.length).to.equal(1);
      expect(championMasteries[0].championId).to.equal('Gangplank');
      expect(championMasteries[0].championName).to.equal('Gangplank');
      expect(championMasteries[0].championLevel).to.equal(7);
      expect(championMasteries[0].championPoints).to.equal(253263);
      expect(championMasteries[0].lastPlayTime).to.equal(1561325679000);
      expect(championMasteries[0].championPointsSinceLastLevel).to.equal(231663);
      expect(championMasteries[0].championPointsUntilNextLevel).to.equal(0);
      expect(championMasteries[0].chestGranted).to.equal(true);
      expect(championMasteries[0].tokensEarned).to.equal(0);
      expect(championMasteries[0].championSquareAssetUrl).to.equal(
        `${config.riotDDragonBaseUrl}/cdn/12.22.1/img/champion/Gangplank.png`);
    }
  );

  it('should handle 404 response from the Summoner endpoint when performing a GET for Champion Masteries', async () => {
    nock(host)
      .get(`${summonersEndpoint}/by-name/MockSummoner404?api_key=${config.riotGamesApiKey}`)
      .reply(404, mock404Error);
    nock(host)
      .get(`${championMasteriesEndpoint}/mock-id-200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockChampionMasteries);

    const params = {
      query: {
        serviceRegion: 'NA',
        summonerName: 'MockSummoner404'
      }
    };
    const championsMasteriesService = new ChampionMasteriesService();

    try {
      await championsMasteriesService.find(params);
    } catch (error) {
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal('Data not found');
    }
  });

  it('should handle 404 response from the Champion Mastery endpoint when performing a GET for Champion Masteries', async () => {
    nock(host)
      .get(`${summonersEndpoint}/by-name/MockSummoner200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockSummoner);
    nock(host)
      .get(`${championMasteriesEndpoint}/mock-id-404?api_key=${config.riotGamesApiKey}`)
      .reply(404, mock404Error);
    nock(config.riotDDragonBaseUrl)
      .get('/api/versions.json')
      .reply(200, ['12.22.1']);
    nock(config.riotDDragonBaseUrl)
        .get('/cdn/12.22.1/data/en_US/champion.json')
        .reply(200, mockChampions);

    const params = {
      query: {
        serviceRegion: 'NA',
        summonerName: 'MockSummoner200'
      }
    };
    const championsMasteriesService = new ChampionMasteriesService();

    try {
      await championsMasteriesService.find(params);
    } catch (error) {
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal('Data not found');
    }
  });

  it('should handle 404 response from the Summoner and Champion Mastery endpoints when performing a GET for Champion Masteries',
    async () => {
      nock(host)
        .get(`${summonersEndpoint}/by-name/MockSummoner404?api_key=${config.riotGamesApiKey}`)
        .reply(404, mock404Error);
      nock(host)
        .get(`${championMasteriesEndpoint}/mock-id-404?api_key=${config.riotGamesApiKey}`)
        .reply(404, mock404Error);

      const params = {
        query: {
          serviceRegion: 'NA',
          summonerName: 'MockSummoner404'
        }
      };
      const championsMasteriesService = new ChampionMasteriesService();

      try {
        await championsMasteriesService.find(params);
      } catch (error) {
        expect(error.statusCode).to.equal(404);
        expect(error.message).to.equal('Data not found');
      }
    }
  );
});
