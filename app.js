const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const cors = require('cors');
const expressRateLimit = require('express-rate-limit');

const config = require('./config');
const ChampionMasteriesService = require('./services/champion-masteries/champion-masteries.service');

const app = express(feathers());

const corsOptions = {
  origin: config.lolotOrigin,
  optionsSuccessStatus: 200
};

const port = process.env.PORT || 8080;

app.use(cors(corsOptions));

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }));

// Set up REST transport using Express
app.configure(express.rest());

// Set up rate limiter to adhere to the rate limits of the Riot Games API key
const rateLimiter = expressRateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100 // 100 requests
});

app.use('api/champion-masteries', rateLimiter, new ChampionMasteriesService());

app.listen(port, () => console.log(`LOLOT REST API listening on http://localhost:${port}`));
