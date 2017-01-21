'use strict';

const path = require('path');
const media = require('./media');
const data = require('./data');


const source = path.join(__dirname, '..', '..', 'data', 'design', 'guidelines');
const target = path.join(__dirname, '..', 'dist', 'media', 'screenshots');
console.log('Loading guidelines');
const sourceGuidelines = data.getGuidelines(source);
console.log('Retrieving guidelines screenshots from %s to %s', source, target);
media.getGuidelinesScreenshots(sourceGuidelines, target)
.then(function(result) {
  let error = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].error) {
      error++;
      console.log('Error on %', result[i].url, result[i].error);
    }
    else {
      console.log('OK %s', result[i].url);
    }
  }
  console.log('Errors: %d', error);
});
