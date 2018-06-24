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

/* eslint no-console: "off" */
const traceApi = require('@google-cloud/trace-agent').start({
  serviceContext: {
    service: 'image-diff'
  }
});
const Storage = require('@google-cloud/storage');
const debug = require('@google-cloud/debug-agent').start();
require('@google-cloud/profiler').start();


const diff = require('./diff');

const storage = new Storage();

/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.imageDiff = (event, callback) => {
  const debugReady = debug.isReady();
  debugReady.then(() => {

    const file = event.data;

    if(!file.name.startsWith('screenshots/')) {
      console.log(`${file.name} is not a screenshot`);
      return callback();
    }

    // extract URL from file:
    var urlFolder;
    try {
      urlFolder = file.name.match(/\/([a-z0-9_]+)\//)[1]
    } catch(e) {
      console.error(`Cannot extract url folder for ${file.name}`);
      callback();
    }
    console.log(`Evaluating ${urlFolder}`);

    // The received image:
    const imageFile = storage.bucket(file.bucket).file(file.name);
    // The reference for this URL:
    const referenceImageFile = storage.bucket(file.bucket).file(`references/${urlFolder}/ref.png`);
    
    // Check that the reference exists
    referenceImageFile.exists().then((data) => {
      const exists = data[0];
      if(!exists) {
        console.log(`Could not find reference for ${urlFolder}`);
        storeAsKeyframeAndReference(urlFolder, imageFile);
      } else {

        // Compare images
        const compareSpan = traceApi.createChildSpan({name: 'compare'});
        areImagesDifferent(referenceImageFile, imageFile, (err, numPixel) => {
          compareSpan.endSpan();
          if(numPixel) {
            console.log(`Difference found for ${urlFolder}: ${numPixel} pixel differ.`);
            // images are different:
            storeAsKeyframeAndReference(urlFolder, imageFile, callback);
          } else {
            console.log(`No difference found for ${urlFolder}`);
            callback();    
          }
        });
      }
    });
  });
};

function storeAsKeyframeAndReference(urlFolder, file, callback) {
  const storeSpan = traceApi.createChildSpan({name: 'store'});
  Promise.all([
    file.copy(`references/${urlFolder}/ref.png`),
    file.copy(file.name.replace('screenshots/', 'keyframes/'))
  ]).then((/* copies */) => {
    storeSpan.endSpan();
    callback();
  });
}

function areImagesDifferent(referenceFile, file, callback) {
  console.log(`Comparing images: ${referenceFile.name} and ${file.name}`);
  // Load both images
  Promise.all([
    file.download(), 
    referenceFile.download()
  ]).then((contents) => {
    var fileContent = contents[0][0];
    var referenceFileContent = contents[1][0];

    diff(fileContent, referenceFileContent, 1680, 1050, callback);
  });
}