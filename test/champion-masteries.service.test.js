const expect = require('chai').expect;
const nock = require('nock');

const config = require('../config');
const mockChampionMasteries = require('./mocks/mock-champion-masteries.json');
const mockSummoner = require('./mocks/mock-summoner.json');
const serviceRegionToHostMap = require('../data/service-region-to-host-map.json');
const ChampionMasteriesService = require('../services/champion-masteries/champion-masteries.service');

const host = serviceRegionToHostMap['NA'];
const summonersEndpoint = '/lol/summoner/v4/summoners';
const championMasteriesEndpoint = '/lol/champion-mastery/v4/champion-masteries/by-summoner';

describe('\"Champion Masteries\" service', () => {
  it('should handle 200 response from the Summoner and Champion Mastery endpoints when performing a GET for Champion Masteries', async () => {
    nock(host)
      .get(`${summonersEndpoint}/by-name/MockSummoner200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockSummoner);
    nock(host)
      .get(`${championMasteriesEndpoint}/mock-id-200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockChampionMasteries);

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

    const championMasteries = championMasteriesResponse.championMasteries;

    expect(championMasteries.length).to.equal(1);
    expect(championMasteries[0].championId).to.equal(41);
    expect(championMasteries[0].championName).to.equal('Gangplank');
    expect(championMasteries[0].championLevel).to.equal(7);
    expect(championMasteries[0].championPoints).to.equal(253263);
    expect(championMasteries[0].lastPlayTime).to.equal(1561325679000);
    expect(championMasteries[0].championPointsSinceLastLevel).to.equal(231663);
    expect(championMasteries[0].championPointsUntilNextLevel).to.equal(0);
    expect(championMasteries[0].chestGranted).to.equal(true);
    expect(championMasteries[0].tokensEarned).to.equal(0);
  });

  it('should handle 404 response from the Summoner endpoint when performing a GET for Champion Masteries', async () => {
    nock(host)
      .get(`${summonersEndpoint}/by-name/MockSummoner404?api_key=${config.riotGamesApiKey}`)
      .replyWithError({
        message: 'Data not found'
      });
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
      expect(error.message).to.equal('Data not found');
    }
  });

  it('should handle 404 response from the Champion Mastery endpoint when performing a GET for Champion Masteries', async () => {
    nock(host)
      .get(`${summonersEndpoint}/by-name/MockSummoner200?api_key=${config.riotGamesApiKey}`)
      .reply(200, mockSummoner);
    nock(host)
      .get(`${championMasteriesEndpoint}/mock-id-404?api_key=${config.riotGamesApiKey}`)
      .replyWithError({
        message: 'Data not found'
      });

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
      expect(error.message).to.equal('Data not found');
    }
  });

  it('should handle 404 response from the Summoner and Champion Mastery endpoints when performing a GET for Champion Masteries',
    async () => {
      nock(host)
        .get(`${summonersEndpoint}/by-name/MockSummoner404?api_key=${config.riotGamesApiKey}`)
        .replyWithError({
          message: 'Data not found'
        });
      nock(host)
        .get(`${championMasteriesEndpoint}/mock-id-404?api_key=${config.riotGamesApiKey}`)
        .replyWithError({
          message: 'Data not found'
        });

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
        expect(error.message).to.equal('Data not found');
      }
    }
  );
});
