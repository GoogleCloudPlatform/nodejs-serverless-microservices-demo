const express = require('express');
const router = express.Router();
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

/* GET home page. */
router.get('/', async (req, res) => {
  const query = datastore.createQuery('Website');
  const results = await datastore.runQuery(query);
  res.render('index', { websites: results[0] });
});

module.exports = router;
