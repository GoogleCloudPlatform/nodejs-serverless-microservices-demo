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
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');

function diff(oldImage, newImage, length, width, callback) {
  // Number of pixels that have to mismatch to consider the images different
  const diffPixelThreshold = 100 * 100; // at least a change equivalent to 100x100px

  const diffBuffer = Buffer.alloc(oldImage.length);
  Promise.all([sharp(oldImage).toBuffer(), sharp(newImage).toBuffer()]).then(images => {
    const diffPixelCount = pixelmatch(images[0], images[1], diffBuffer, length, width, {
      includeAA: true, // Ignore Anti-aliasing in diff
      threshold: 0.3, // be less sensitive than default (0.1) to determine if a pixel has changed.
    });
    if (diffPixelCount === diffPixelThreshold) return callback(null, false);
    callback(null, diffPixelCount, diffBuffer);
  });
}

module.exports = diff;
