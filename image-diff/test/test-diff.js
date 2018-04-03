const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const tap = require('tap').test;

const diff = require('../diff.js');

const one = fs.readFileSync(path.resolve(__dirname, 'one.jpg'));
const two = fs.readFileSync(path.resolve(__dirname, 'two.jpg'));

tap('the same image should return true', (t) => {
  t.plan(4);
  diff(one, one, 400, 400, (err, difference, buffer) => {
    t.notok(difference, 'there should be no pixel diff');
    t.notok(buffer, 'there should be no diff buffer returned');
  });
  diff(two, two, 400, 400, (err, difference, buffer) => {
    t.notok(difference, 'there should be no pixel diff');
    t.notok(buffer, 'there should be no diff buffer returned');
  });
});

tap('different images should return true', (t) => {
  t.plan(4);
  diff(one, two, 400, 400, (err, difference, buffer) => {
    t.ok(difference, 'there should be a pixel difference');
    t.ok(buffer && buffer.length, 'there should be a buffer returned with difference');
  });
  diff(two, one, 400, 400, (err, difference, buffer) => {
    t.ok(difference, 'there should be a pixel difference');
    t.ok(buffer && buffer.length, 'there should be a buffer returned with difference');
  });
});
