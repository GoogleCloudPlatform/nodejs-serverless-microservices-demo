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

// the following is a workaround:
// Cloud Storage library tries to write in /home/ when uploading a buffer
process.env.HOME = '/tmp';

// Stackdriver APM
const traceApi = require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({allowExpressions: true});
require('@google-cloud/profiler').start();

const bodyParser = require('body-parser');
const express = require('express');
const puppeteer = require('puppeteer');
const Storage = require('@google-cloud/storage');

const logger = require('./logger');

const storage = new Storage();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Ignore Favicon
app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
    return;
  }
  next();
});

function getUrl(req) {
  let url;
  if(!req.body.message) {
    url = req.query.url;
    return url;
  }
  const parsedPayload = JSON.parse(Buffer.from(req.body.message.data, 'base64').toString('utf-8'))
  url = parsedPayload.url;
  return url;
}

async function startBrowser(url) {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 90000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1680,
    height: 1050
  });
  return [browser, page];
}

async function hideCursor(page) {
   // Custom CSS to avoid capturing blinking cursors when input fields have focus
  const hideInputTextCSS = `
    input {
      color: transparent;
      text-shadow: 0 0 0 black;
    }
    input:focus {
      outline: none;
    }
  `;
  await page.addStyleTag({ content: hideInputTextCSS });
}

async function takeScreenshot(url) {
  const span = traceApi.createChildSpan({name: 'screenshot'});
  let browser;
  let page;
  const spanChrome = traceApi.createChildSpan({name: 'start-chrome'});
  [browser, page] = await startBrowser(url);
  spanChrome.endSpan();

  await hideCursor(page);

  logger.info(`URL: ${url} - starting screenshot`);
  const imageBuffer = await page.screenshot();
  logger.info(`URL: ${url} - screenshot taken`);

  await browser.close();
  span.endSpan();
  return imageBuffer;
}

async function saveToBucket(imageBuffer, url) {
  // Uploads a local file to the bucket

  const span = traceApi.createChildSpan({name: 'save'});
  logger.info(`URL: ${url} - saving screenshot to GCS bucket: ${process.env.SCREENSHOT_BUCKET_NAME}`);

  const bucketName = process.env.SCREENSHOT_BUCKET_NAME;
  const date = new Date();
  const timestamp = date.getTime();
  const filename = `${timestamp}.png`;
  const filepath = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  
  const bucket = storage.bucket(bucketName);

  const file = bucket.file(`screenshots/${filepath}/${filename}`);

  await file.save(imageBuffer);

  logger.info(`URL: ${url} - screenshot saved`);
  span.endSpan();
}

app.use(async (req, res, next) => {
  const url = getUrl(req);

  if(!url) {
    const err = new Error('Please provide URL as GET parameter or in POST body, example: ?url=http://example.com')
    next(err);
    return;
  }

  // make sure the URL starts with a protocol
  if(!url.startsWith('http')) {return res.status(400).send('URL must start with http:// or https://');}

  logger.debug(`URL: ${url}`);

  try {
    const imageBuffer = await takeScreenshot(url);
    await saveToBucket(imageBuffer, url);
    // returns the screenshot
    res.set('Content-Type', 'image/png')
    res.send(imageBuffer);
  }
  catch (err) {
    next(err);
    return;
  }
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // log the error
  logger.error(err);

  // render the error page
  res.status(err.status || 500);
  res.end(err.message);
});

const server = app.listen(process.env.PORT || 8080, err => {
  if (err) return logger.error(err);
  const port = server.address().port;
  logger.info(`App listening on port ${port}`)
});