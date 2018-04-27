'use strict';

const express = require('express');
const Datastore = require('@google-cloud/datastore');

const logger = require('../logger');

const router = express.Router();
const datastore = new Datastore();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const query = datastore.createQuery('Website');
  let results;
  try {
    results = await datastore.runQuery(query);
    res.render('index', { websites: results[0] });
  }
  catch (err) {
    next(err);
    return;
  }
});

module.exports = router;
