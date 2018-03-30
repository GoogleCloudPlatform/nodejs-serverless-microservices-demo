const express = require('express');
const router = express.Router();
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

/* GET home page. */
router.get('/', (req, res, next) => {
  const query = datastore
    .createQuery('Website');
  datastore.runQuery(query).then(results => {
    res.render('index', { websites: results[0] });
  });
});

module.exports = router;
