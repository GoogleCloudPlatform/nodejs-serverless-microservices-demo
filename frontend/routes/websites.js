/*
Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
'use strict';

const express = require('express');
const Datastore = require('@google-cloud/datastore');
const Storage = require('@google-cloud/storage');

const logger = require('../logger');

const router = express.Router();
const storage = new Storage();
const datastore = new Datastore();

/* displays a new message, creates it if needed */
router.get('/', async (req, res, next) => {
  const url = req.query.url;
  if(!url) {
    logger.info('400: URL not provided');
    return res.status(400).send('Please provide a URL.');
  }

  let website;

  logger.info(`Looking for website ${url}`);

  // Look for this website
  // TODO: use some memcache
  const query = datastore
    .createQuery('Website')
    .filter('url', '=', url);
  let results;
  try {
    results = await datastore.runQuery(query);
  }
  catch (err) {
    next(err);
    return;
  }
  if(results[0] && results[0].length > 0) {
    // website found
    website = results[0][0];
    logger.info(`Website found: ${website.url}`);
  } else {
    logger.info(`Website not found: ${url}`);
    // website does not exist, create it

    //make sure it starts with an http or https protocol
    if(!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    const taskKey = datastore.key('Website');
    const newWebsite = {
      key: taskKey,
      data: {
        url: url,
      },
    };
    try {
      await datastore.save(newWebsite);
    }
    catch (err) {
      next(err);
      return;
    }
    logger.info(`New website saved: ${url}`);
    website = newWebsite.data;
  }

  // retrieve keyframes
  // TODO should we have a sane default if this fails?
  const bucketName = process.env.BUCKET_NAME;
  logger.info(`bucketName: ${bucketName}`);
  const urlPath = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const pathPrefix = 'keyframes';
  const options = {
    prefix: `${pathPrefix}/${urlPath}/`,
    delimiter: '/'
  };
  let gcsResults;
  try {
    gcsResults = await storage.bucket(bucketName).getFiles(options)
  }
  catch (err) {
    next(err);
    return;
  }
  const files = gcsResults[0];
  files.map( file => {
    file.url = ` https://storage.googleapis.com/${bucketName}/${file.name}`;
  })
  logger.info(`${files.length} keyframes found for ${url}`)

  res.render('website', { website, keyframes: files });
});

module.exports = router;
