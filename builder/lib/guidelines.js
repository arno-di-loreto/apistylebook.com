'use strict';

const mkdirp = require('mkdirp');
const path = require('path');
const clone = require('clone');

const utils = require('./utils');
const apitopics = require('./topics');
const dlib = require('./data');
const jekyll = require('./jekyll');

/**
 * @description Returns API guideline's topics data for topics
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} guideline Guideline from data.getGuidelines
 * @param {Object} topics List of topics returned data.getTopics
 * @return {Object} API Object for guideline's topics
 */
function getApiGuidelineTopics(root, format, guideline, topics) {
  const result = {
    items: [],
    _embedded: {
      guideline: getApiGuideline(root, format, guideline)
    },
    _links: {
      self: {
        href: root + '/design/guidelines/' + guideline.id + '/topics' + format
      },
      guideline: {
        href: root + '/design/guidelines/' + guideline.id + format
      }
    }
  };
  // eslint-disable-next-line guard-for-in
  for (let topic in guideline.topics) {
    result.items.push({
      references: guideline.topics[topic],
      _embedded: {
        topic: apitopics.getApiTopic(
          root, format, dlib.getTopic(topic, topics))
      },
      _links: {
        topic: {
          href:
            root + '/design/topics/' + topic + format
        }
      }
    });
  }
  return result;
}

/**
 * @description Returns API data for a guideline
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} guideline A guideline from utils.getGuideline
 * @return {Object} API Object for a guideline
 */
function getApiGuideline(root, format, guideline) {
  const result = clone(guideline);
  delete result.topics;
  const links = {
    self: {
      href: root + '/design/guidelines/' + guideline.id + format
    }
  };

  if (guideline.hasOwnProperty('reviewDate') &&
      guideline.reviewDate !== null &&
      guideline.reviewDate !== undefined) {
    result.reviewDate = guideline.reviewDate;
    links.guidelineTopics = {
      href: root + '/design/guidelines/' + guideline.id + '/topics' + format
    };
  }

  result._links = links;

  return result;
}

/**
 * @description Returns API data for guidelines
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} guidelines List of guidelines (utils.getGuidelines)
 * @return {Object} API Object for guidelines
 */
function getApiGuidelines(root, format, guidelines) {
  const result = {
    items: [],
    _links: {
      self: {
        href: root + '/design/guidelines' + format
      },
      design: {
        href: root + '/design' + format
      }
    }
  };
  for (let i = 0; i < guidelines.length; i++) {
    result.items.push(getApiGuideline(root, format, guidelines[i]));
  }
  return result;
}

/**
 * @description Save API topics list on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object} guidelines (returned by utils.getGuidelines)
 */
function saveApiGuidelines(rootdir, rooturl, formats, guidelines) {
  mkdirp.sync(path.join(rootdir, 'guidelines'));
  for (let i = 0; i < formats.length; i++) {
    if (formats[i].localeCompare('jekyll') !== 0) {
      const apiGuidelinesFilename = path.join(rootdir, 'guidelines');
      const apiGuidelines =
        getApiGuidelines(rooturl, formats[i], guidelines);
      utils.saveFile(apiGuidelinesFilename, formats[i], apiGuidelines);
      for (let j = 0; j < apiGuidelines.items.length; j++) {
        const apiGuideline = apiGuidelines.items[j];
        const apiGuidelineFilename =
          path.join(apiGuidelinesFilename, apiGuideline.id);
        utils.saveFile(apiGuidelineFilename, formats[i], apiGuideline);
      }
    }
  }
}

/**
 * @description Save API topics list on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object} guidelines List of guideline returned by utils.getGuidelines
 * @param {Object} topics List of topics returned by utils.getTopics
 */
function saveApiGuidelinesTopics(
  rootdir, rooturl, formats, guidelines, topics) {
  const guidelinesDir = path.join(rootdir, 'guidelines');
  mkdirp.sync(guidelinesDir);
  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];
    let linkformat;
    let fileformat;
    if (format.localeCompare('jekyll') === 0) {
      linkformat = '';
      fileformat = '.md';
    }
    else {
      linkformat = format;
      fileformat = format;
    }
    for (let j = 0; j < guidelines.length; j++) {
      const guideline = guidelines[j];
      let guidelineTopicsFilename;
      let data;
      const guidelineTopics =
        getApiGuidelineTopics(rooturl, linkformat, guideline, topics);
      if (format.localeCompare('jekyll') === 0) {
        guidelineTopicsFilename =
          path.join(guidelinesDir, guideline.id + '-topics');
        data = jekyll.getJekyllGuidelinePage(guidelineTopics);
      }
      else {
        const guidelineTopicsDirname =
        path.join(guidelinesDir, guideline.id);
        guidelineTopicsFilename =
          path.join(guidelineTopicsDirname, 'topics');
        mkdirp.sync(guidelineTopicsDirname);
        data = guidelineTopics;
      }
      utils.saveFile(guidelineTopicsFilename, fileformat, data);
    }
  }
}

/**
 * @description Save API guidelines, all guideline and all guideline's topics on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object} guidelines List of guideline returned by utils.getGuidelines
 * @param {Object} topics List of topics returned by utils.getTopics
 */
function save(rootdir, rooturl, formats, guidelines, topics) {
  saveApiGuidelines(rootdir, rooturl, formats, guidelines);
  saveApiGuidelinesTopics(rootdir, rooturl, formats, guidelines, topics);
}

exports._getApiGuidelineTopics = getApiGuidelineTopics;
exports._getApiGuidelines = getApiGuidelines;
exports._saveApiGuidelines = saveApiGuidelines;
exports._saveApiGuidelinesTopics = saveApiGuidelinesTopics;
exports.getApiGuideline = getApiGuideline;
exports.save = save;
