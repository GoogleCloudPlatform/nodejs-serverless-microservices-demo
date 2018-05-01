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
  const diffBuffer = Buffer.alloc(oldImage.length);
  Promise.all([sharp(oldImage).toBuffer(), sharp(newImage).toBuffer()]).then(images => {
    const diffPixelCount = pixelmatch(images[0], images[1], diffBuffer, length, width);
    if (diffPixelCount === 0) return callback(null, false);
    callback(null, diffPixelCount, diffBuffer);
  });
}

module.exports = diff;
