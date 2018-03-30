
const express = require('express');
const router = express.Router();
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();

/* displays a new message, creates it if needed */
router.get('/', async (req, res) => {
  const url = req.query.url;
  if(!url) {
    return res.status(400).send('Please provide a URL.');
  }

  let website;

  console.log(`Looking for website ${url}`)

  // Look for this website
  // TODO: use some memcache
  const query = datastore
    .createQuery('Website')
    .filter('url', '=', url);
  const results = await datastore.runQuery(query);
  if(results[0] && results[0].length > 0) {
    // website found
    website = results[0][0];
    console.log(`Website found: ${website.url}`);
  } else {
    console.log(`Website not found: ${url}`);
    // website does not exist, create it
    const taskKey = datastore.key('Website');
    const newWebsite = {
      key: taskKey,
      data: {
        url: url,
      },
    };
    await datastore.save(newWebsite);
    console.log(`New website saved: ${url}`);
    website = newWebsite.data;
  }

  res.render('website', { website });
});

module.exports = router;
