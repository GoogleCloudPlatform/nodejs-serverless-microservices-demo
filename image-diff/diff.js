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
