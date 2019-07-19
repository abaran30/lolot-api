const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const cors = require('cors');

const config = require('./config');
const ChampionMasteriesService = require('./services/champion-masteries/champion-masteries.service');

const app = express(feathers());

const corsOptions = {
  origin: config.lolotOrigin,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Turn on JSON body parsing for REST services
app.use(express.json())

// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }));

// Set up REST transport using Express
app.configure(express.rest());

app.use('api/champion-masteries', new ChampionMasteriesService());

app.listen(3030, () => console.log('LOLOT REST API listening on http://localhost:3030'));
