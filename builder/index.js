'use strict';

const topics = require('./lib/topics');
const guidelines = require('./lib/guidelines');
const data = require('./lib/data');
const mkdirp = require('mkdirp');
const path = require('path');

try {
  console.log('Loading topics...');
  const sourceTopics = data.getTopics();
  console.log('Loading guidelines...');
  const sourceGuidelines = data.getGuidelines();
  console.log('Generating API data...');
  let root = path.join(__dirname, 'dist', 'api', 'design');
  mkdirp.sync(root);
  console.log('saving guidelines data...');
  guidelines.save(root, '', ['.json', '.yaml'], sourceGuidelines, sourceTopics);
  console.log('saving topics data...');
  topics.save(root, '', ['.json', '.yaml'], sourceTopics, sourceGuidelines);
  console.log('API data generated in %s', root);

  console.log('Generating jekyll files...');
  root = path.join(__dirname, 'dist', 'web', 'design');
  mkdirp.sync(root);
  console.log('saving guidelines data...');
  guidelines.save(root, '', ['jekyll'], sourceGuidelines, sourceTopics);
  console.log('saving topics data...');
  topics.save(root, '', ['jekyll'], sourceTopics, sourceGuidelines);
  console.log('Jekyll files generated in %s', root);

  process.exit(0);
}
catch (error) {
  console.log('Unexpected error occured', error);
  process.exit(1);
}
