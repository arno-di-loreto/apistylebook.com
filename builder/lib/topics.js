'use strict';

const mkdirp = require('mkdirp');
const clone = require('clone');
const path = require('path');

const utils = require('./utils');
const apiguidelines = require('./guidelines');
const dlib = require('./data');
const jekyll = require('./jekyll');

/**
 * @description Return an API Topic
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} topic Topic (from data.getTopics)
 * @return {Object} An API Topic
 */
function getApiTopic(root, format, topic) {
  const result = clone(topic);
  delete result.guidelines;
  result._links = {
    self: {
      href: root + '/design/topics/' + topic.id + format
    },
    topicGuidelines: {
      href: root + '/design/topics/' + topic.id + '/guidelines' + format
    }
  };
  return result;
}

/**
 * @description Returns API data for topics
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} topics List of topics returned by utils.getTopics
 * @return {Object} API Object for topics
 */
function getApiTopics(root, format, topics) {
  const result = {
    items: [],
    _links: {
      self: {
        href: root + '/design/topics' + format
      },
      design: {
        href: root + '/design' + format
      }
    }
  };
  // eslint-disable-next-line guard-for-in
  for (let i = 0; i < topics.length; i++) {
    result.items.push(getApiTopic(root, format, topics[i]));
  }
  return result;
}

/**
 * @description Save API topics list and details on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object} topics Topics (returned by utils.getTopics)
 */
function saveApiTopics(rootdir, rooturl, formats, topics) {
  mkdirp.sync(path.join(rootdir, 'topics'));
  for (let i = 0; i < formats.length; i++) {
    if (formats[i].localeCompare('jekyll') !== 0) {
      const apitopicsFilename = path.join(rootdir, 'topics');
      const apiTopics = getApiTopics(rooturl, formats[i], topics);
      utils.saveFile(apitopicsFilename, formats[i], apiTopics);
      for (let j = 0; j < apiTopics.items.length; j++) {
        const apiTopic = apiTopics.items[j];
        const apiTopicFilename = path.join(rootdir, 'topics', apiTopic.id);
        utils.saveFile(apiTopicFilename, formats[i], apiTopic);
      }
    }
  }
}

/**
 * @description Returns API guidelines data for topics
 * @param {String} root href root
 * @param {String} format (.json, .yaml)
 * @param {Object} topic Topic element from data.getTopics
 * @param {Object[]} guidelines List of guidelines returned by data.getGuidelines
 * @return {Object} API Object for topics
 */
function getApiTopicGuidelines(root, format, topic, guidelines) {
  const result = {
    items: [],
    _embedded: {
      topic: getApiTopic(root, format, topic)
    },
    _links: {
      self: {
        href: root + '/design/topics/' + topic.id + '/guidelines' + format
      },
      topic: {
        href: root + '/design/topics/' + topic.id + format
      }
    }
  };
  for (let i = 0; i < topic.guidelines.length; i++) {
    const guideline = topic.guidelines[i];
    result.items.push({
      references: guideline.references,
      _embedded: {
        guideline: apiguidelines.getApiGuideline(
          root, format, dlib.getGuideline(guideline.id, guidelines))
      },
      _links: {
        guideline: {
          href:
            root + '/design/guidelines/' + guideline.id + format
        }
      }
    });
  }
  return result;
}

/**
 * @description Save API topics list and details on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object[]} topics List of topics returned by data.getTopics
 * @param {Object[]} guidelines List of guidelines returned by data.getGuidelines
 */
function saveApiTopicsGuidelines(rootdir, rooturl, formats, topics, guidelines) {
  const topicsDir = path.join(rootdir, 'topics');
  mkdirp.sync(topicsDir);
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
    for (let j = 0; j < topics.length; j++) {
      const topic = topics[j];
      let topicGuidelinesFilename;
      let data;
      const topicGuidelines =
        getApiTopicGuidelines(
          rooturl, linkformat, topic, guidelines);
      if (format.localeCompare('jekyll') === 0) {
        topicGuidelinesFilename =
          path.join(topicsDir, topic.id + '-guidelines');
        data = jekyll.getJekyllTopicPage(topicGuidelines);
      }
      else {
        const topicGuidelinesDirname =
          path.join(rootdir, 'topics', topic.id);
        mkdirp.sync(topicGuidelinesDirname);
        topicGuidelinesFilename =
          path.join(topicGuidelinesDirname, 'guidelines');
        data = topicGuidelines;
      }
      utils.saveFile(topicGuidelinesFilename, fileformat, data);
    }
  }
}

/**
 * @description Save API topics list and details on file system
 * @param {String} rootdir Base directory for storing files
 * @param {String} rooturl Base URL for hrefs
 * @param {String[]} formats A list of formats (.json, .yaml)
 * @param {Object[]} topics List of topics returned by data.getTopics
 * @param {Object[]} guidelines List of guidelines returned by data.getGuidelines
 */
function save(rootdir, rooturl, formats, topics, guidelines) {
  saveApiTopics(rootdir, rooturl, formats, topics);
  saveApiTopicsGuidelines(rootdir, rooturl, formats, topics, guidelines);
}

exports.getApiTopic = getApiTopic;
exports._getApiTopics = getApiTopics;
exports._getApiTopicGuidelines = getApiTopicGuidelines;
exports._saveApiTopics = saveApiTopics;
exports._saveApiTopicsGuidelines = saveApiTopicsGuidelines;
exports.save = save;
