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
const fs = require('fs');
const path = require('path');

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
