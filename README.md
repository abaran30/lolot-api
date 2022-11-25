# LOLOT API

LOLOT API is a REST API used in conjunction with the [LOLOT UI web application](https://github.com/abaran30/lolot-ui), which allows *League of Legends* players to keep track of their Hextech Chest rewards via Champion Mastery for the current season.

## Development

This REST API was developed using [FeathersJS](https://feathersjs.com/).

## Configuration

### Riot Games API Key

A Riot Games API key is required to use this REST API. The REST API is set up to consume the API key via environment variable `RIOT_GAMES_API_KEY` (see [config.js](https://github.com/abaran30/lolot-api/blob/master/config.js)). You can obtain an API key from the [Riot Games Developer portal](https://developer.riotgames.com/).

### CORS

The REST API is using CORS, but an origin has to be set (see [app.js](https://github.com/abaran30/lolot-api/blob/master/app.js)). The origin can be set to environment variable `LOLOT_ORIGIN` (see [config.js](https://github.com/abaran30/lolot-api/blob/master/config.js)).

## How to Set Up and Run Locally
### Prerequisites
+ Make sure the aforementioned **Configuration** options have been addressed.
+ Make sure [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), and [npm](https://www.npmjs.com/) are installed and configured on your machine.

### Steps
1. Clone this repository to a location of your choosing with:
``` bash
git clone https://github.com/abaran30/lolot-api.git
```

2. Inside the cloned directory, run:
``` bash
npm install
```

3. Once the npm packages have been installed, run:
``` bash
npm start
```

4. The REST API will start locally on http://localhost:8080 (port set by default).

## Testing

Testing is configured to use [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), and [Nock](https://github.com/nock/nock#readme), with [nyc](https://github.com/istanbuljs/nyc#readme) used to report coverage.

To run the tests, run:
``` bash
npm test
```

## Disclaimer

LOLOT isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
