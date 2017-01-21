'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const DIR_DATA = path.join(__dirname, '..', '..', 'data', 'design');
const DIR_GUIDELINES = path.join(DIR_DATA, 'guidelines');
const FILE_TOPICS = path.join(DIR_DATA, 'topics.yaml');

/**
 * @description: Loads all guidelines yaml files in a directory
 * @param {String} [guidelinesDir=__dirname/data/design/guidelines] The directory name
 * @return {Object[]} An array of guidelines
 */
function getGuidelines(guidelinesDir) {
  if (!guidelinesDir) {
    guidelinesDir = DIR_GUIDELINES;
  }
  const filenames = fs.readdirSync(guidelinesDir);
  const result = [];
  for (let i = 0; i < filenames.length; i++) {
    const guideline =
      yaml.safeLoad(
        fs.readFileSync(path.join(guidelinesDir, filenames[i]), 'utf8'));
    result.push(guideline);
  }
  return result;
}

/**
 * @description return all topics from all guidelines
 * @param {Object[]} guidelines An array of guideline objects
 * @return {Object} Topics map
 */
function getTopicsFromGuidelines(guidelines) {
  const result = {};
  for (let i = 0; i < guidelines.length; i++) {
    const guideline = guidelines[i];
    if (guideline.hasOwnProperty('topics')) {
      // eslint-disable-next-line guard-for-in
      for (let topic in guideline.topics) {
        if (!result.hasOwnProperty(topic)) {
          result[topic] = {
            guidelines: []
          };
        }
        result[topic].guidelines.push({
          id: guideline.id,
          references: guideline.topics[topic]
        });
      }
    }
  }
  return result;
}

/**
 * @description: Loads a topics yaml file
 * @param {String} [topicsFile=__dirname/data/design/topics.yaml] The filename
 * @return {Object[]} An array of topics
 */
function getTopicsRaw(topicsFile) {
  if (!topicsFile) {
    topicsFile = FILE_TOPICS;
  }
  console.log(__dirname);
  console.log(topicsFile);
  const result = yaml.safeLoad(
    fs.readFileSync(topicsFile, 'utf8'));
  return result;
}

/**
 * @description: Loads topics yaml file and aggregate references from guidelines
 * @param {Object} topicsRaw Topics (getTopicsRaw)
 * @param {Object} guidelines Guidelines (getGuidelines)
 * @return {Object[]} An array of guidelines
 */
function getTopicsFromObject(topicsRaw, guidelines) {
  const result = [];
  const topicsFromGuidelines = getTopicsFromGuidelines(guidelines);
  for (let topicId in topicsFromGuidelines) {
    const topicRaw = topicsRaw[topicId];
    if (topicsRaw[topicId] === undefined) {
      throw Error('Undefined topic ' + topicId);
    }
    else {
      const topicGuidelines = topicsFromGuidelines[topicId];
      const topic = {
        id: topicId,
        guidelines: topicGuidelines.guidelines
      };
      for (let property in topicRaw) {
        topic[property] = topicRaw[property];
      }
      result.push(topic);
    }
  }
  for (let topicId in topicsRaw) {
    if (getTopic(topicId, result) === undefined) {
      throw Error('Unused topic ' + topicId);
    }
  }
  return result;
}

/**
 * @description: Loads topics yaml file and aggregate references from guidelines
 * @param {String} [topicsFile=__dirname/data/design/topics.yaml] The filename
 * @param {String} [guidelinesDir=__dirname/data/design/guidelines] The directory name
 * @return {Object[]} An array of guidelines
 */
function getTopics(topicsFile, guidelinesDir) {
  const topicsRaw = getTopicsRaw(topicsFile);
  const guidelines = getGuidelines(guidelinesDir);
  return getTopicsFromObject(topicsRaw, guidelines);
}

/**
 * @description Gets a guideline for its id
 * @param {String} id Guideline's id
 * @param {Object[]} guidelines Guidelines list
 * @return {Object} A guideline
 */
function getGuideline(id, guidelines) {
  let result;
  for (let i = 0; i < guidelines.length; i++) {
    if (id.localeCompare(guidelines[i].id) === 0) {
      result = guidelines[i];
      break;
    }
  }
  return result;
}

/**
 * @description Gets a topic for its id
 * @param {String} id Topic's id
 * @param {Object[]} topics Topics list
 * @return {Object} A topic
 */
function getTopic(id, topics) {
  let result;
  for (let i = 0; i < topics.length; i++) {
    if (id.localeCompare(topics[i].id) === 0) {
      result = topics[i];
      break;
    }
  }
  return result;
}

exports.getGuidelines = getGuidelines;
exports._getTopicsFromGuidelines = getTopicsFromGuidelines;
exports._getTopicsRaw = getTopicsRaw;
exports._getTopicsFromObject = getTopicsFromObject;
exports.getTopics = getTopics;
exports.getGuideline = getGuideline;
exports.getTopic = getTopic;
