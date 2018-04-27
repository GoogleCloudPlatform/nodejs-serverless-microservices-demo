'use strict';

const http = require("http");

const Datastore = require('@google-cloud/datastore');

const logger = require('./logger');
const createScreenshotTask = require('./lib/create-screenshot-task');

const datastore = new Datastore();

const server = http.createServer(async (req, res) => {
  logger.info('Looking for new tasks to schedule...');

  const query = datastore.createQuery('Website');
  
  let results;

  try {
    results = await datastore.runQuery(query);
  }
  catch (err) {
    logger.error(err);
    res.writeHead(500);
    res.end('internal server error');
    return;
  }

  const websites = results[0];

  logger.info(`Found ${websites.length} urls to screenshot, creating tasks...`)

  websites.forEach((website) => {
    // TODO return promise and await
    createScreenshotTask(`/${website.url}`);
  })
  
  logger.info(`${websites.length} tasks scheduled`);

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('done');
});

server.listen(process.env.PORT || 8080);
