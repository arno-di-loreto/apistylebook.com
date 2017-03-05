'use strict';

const webshot = require('webshot');
const async = require('async');
const clone = require('clone');
const path = require('path');


const TARGET = path.join(__dirname, '..', 'dist', 'media', 'screenshots');
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;

/**
 * @description Returns webshot module options
 * @param {Number} width Window and screenshot width
 * @param {Number} height Window and screenshot height
 * @return {Object} Webshot module options
 */
function getWebshotOptions(width, height) {
  if (width === undefined) {
    width = DEFAULT_WIDTH;
  }
  if (height === undefined) {
    height = DEFAULT_HEIGHT;
  }
  const options = {
    screenSize: {
      width: width,
      height: height
    },
    shotSize: {
      width: width,
      height: height
    },
    defaultWhiteBackground: true
  };
  return options;
}

/**
 * @description Takes a screenshot of a website and save it as a PNG file
 * @param {String} url The website's url
 * @param {String} filename PNG filename
 * @param {Number} [width=1280] Screenshot width
 * @param {Number} [height=800] Screenshot height
 * @return {Promise} A promise
 */
function screenshot(url, filename, width, height) {
  const p = new Promise(function(resolve, reject) {
    const options = getWebshotOptions(width, height);
    webshot(url, filename, options, function(err) {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
  return p;
}

/**
 * @description Function for screenshots
 * @param {Object} data Data for screenshot
 * @param {Function} callback Callback function
 */
function screenshotsItem(data, callback) {
  const url = data.url;
  const filename = data.filename;
  const width = data.width;
  const height = data.height;
  screenshot(url, filename, width, height)
  .then(function() {
    callback(null, clone(data));
  })
  .catch(function(error) {
    const result = clone(data);
    result.error = error;
    callback(null, result);
  });
}

/**
 * @description Tak screenshots of multiple pages
 * @param {Object[]} pages The pages
 * @return {Promise} A promise
 */
function screenshots(pages) {
  const p = new Promise(function(resolve) {
    async.map(pages, screenshotsItem, function(error, results) {
      resolve(results);
    });
  });
  return p;
}

/**
 * @description Gets guidelines screenshots target dir
 * @param {String} target Custom target dir
 * @return {String} Target dir
 */
function getGuidelinesScreenshotsTarget(target) {
  let result;
  if (target) {
    result = target;
  }
  else {
    result = TARGET;
  }
  return result;
}

/**
 * @description Gets guidelines screenshots
 * @param {Object[]} guidelines Guidelines (data.getGuidelines)
 * @param {String} target Target directory for screenshots
 * @return {Promise} A promise
 */
function getGuidelinesScreenshots(guidelines, target) {
  const p = new Promise(function(resolve) {
    const files = [];
    const dir = getGuidelinesScreenshotsTarget(target);
    for (let i = 0; i < guidelines.length; i++) {
      files.push({
        url: guidelines[i].url,
        filename: path.join(dir, guidelines[i].id + '.png')
      });
    }
    screenshots(files)
    .then(function(result) {
      resolve(result);
    });
  });
  return p;
}

exports._getWebshotOptions = getWebshotOptions;
exports.screenshot = screenshot;
exports._screenshotsItem = screenshotsItem;
exports.screenshots = screenshots;
exports._getGuidelinesScreenshotsTarget = getGuidelinesScreenshotsTarget;
exports._TARGET = TARGET;
exports.getGuidelinesScreenshots = getGuidelinesScreenshots;
