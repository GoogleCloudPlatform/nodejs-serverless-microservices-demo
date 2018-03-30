
const express = require('express');
const router = express.Router();
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

/* displays a new message, creates it if needed */
router.get('/', (req, res) => {
  if(!req.query.url) {
    return res.status(400).send('Please provide a URL.');
  }

  // TODO: look for this website, if exists, just display data without creating it.

  const taskKey = datastore.key('Website');
  const website = {
    key: taskKey,
    data: {
      url: req.query.url,
    },
  };

  // Saves the entity
  datastore
    .save(website)
    .then(() => {
      console.log(`Saved ${website.key.path}: ${website.data.url}`);
      return res.redirect('/');
    })
    .catch(err => {
      console.error('ERROR:', err);
      return res.status(500).send(err);
    });
});

module.exports = router;
