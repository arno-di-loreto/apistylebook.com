'use strict';

const yaml = require('js-yaml');

/**
 * @description Generate a jekyll page
 * @param {String} layout Layout name
 * @param {String} title Page title
 * @param {String} permalink Page link
 * @param {Object} fields Map added to YAML front
 * @param {String} content Page content (markdown string)
 * @return {String} Jekyll file content
 */
function getJekyllPage(layout, title, permalink, fields, content) {
  const page = {
    layout: layout,
    title: title,
    permalink: permalink
  };
  for (let name in fields) {
    page[name] = fields[name];
  }
  let str =
    '---\n' +
    yaml.dump(page, {noRefs: true, lineWidth: -1}) +
    '---';
  if (content) {
    str += '\n' + content;
  }
  return str;
}

/**
 * @description Return jekyll data for guideline and its topics
 * @param {Object} guidelineTopics The guideline and its topics
 * @return {Object} Jekyll data
 */
function getJekyllGuidelineData(guidelineTopics) {
  const guideline = guidelineTopics._embedded.guideline;
  const layout = 'guideline';
  const permalink = guideline._links.self.href;
  const title = guideline.title;

  const fields = {
    sort: guideline.company + '_' + guideline.title
  };
  for (let field in guideline) {
    if (field.localeCompare('_links') !== 0) {
      fields['guideline_' + field] = guideline[field];
    }
  }
  const topics = [];
  for (let i = 0; i < guidelineTopics.items.length; i++) {
    const topic = guidelineTopics.items[i]._embedded.topic;
    const references = guidelineTopics.items[i].references;
    const jekyllTopic = {};
    for (let field in topic) {
      jekyllTopic['topic_' + field] = topic[field];
    }
    jekyllTopic.references = references;
    topics.push(jekyllTopic);
  }
  fields.topics = topics;
  return {
    layout: layout,
    permalink: permalink,
    title: title,
    fields: fields
  };
}

/**
 * @description Returns jekyll data for a guideline including topics
 * @param {Object} guidelineTopics The guideline and its topics
 * @return {String} Jekyll file content
 */
function getJekyllGuidelinePage(guidelineTopics) {
  const jdata = getJekyllGuidelineData(guidelineTopics);
  return getJekyllPage(
    jdata.layout,
    jdata.title,
    jdata.permalink,
    jdata.fields);
}

/**
 * @description Returns jekyll data for a topic and its guidelines
 * @param {Object} topicGuidelines The topic and its guidelines
 * @return {Object} Jekyll data
 */
function getJekyllTopicData(topicGuidelines) {
  const topic = topicGuidelines._embedded.topic;
  const layout = 'topic';
  const permalink = topic._links.self.href;
  const title = topic.name;
  const fields = {
    sort: topic.category + '_' + topic.name
  };
  for (let field in topic) {
    if (field.localeCompare('_links') !== 0) {
      fields['topic_' + field] = topic[field];
    }
  }
  const guidelines = [];
  for (let i = 0; i < topicGuidelines.items.length; i++) {
    const guideline = topicGuidelines.items[i]._embedded.guideline;
    const references = topicGuidelines.items[i].references;
    const jekyllGuideline = {};
    for (let field in guideline) {
      jekyllGuideline['guideline_' + field] = guideline[field];
    }
    jekyllGuideline.references = references;
    guidelines.push(jekyllGuideline);
  }
  fields.guidelines = guidelines;
  return {
    layout: layout,
    permalink: permalink,
    title: title,
    fields: fields
  };
}

/**
 * @description Returns jekyll data for a topic including guidelines
 * @param {Object} topicGuidelines The topic and its guidelines
 * @return {String} Jekyll file content
 */
function getJekyllTopicPage(topicGuidelines) {
  const jdata = getJekyllTopicData(topicGuidelines);
  return getJekyllPage(
    jdata.layout,
    jdata.title,
    jdata.permalink,
    jdata.fields);
}

exports._getJekyllPage = getJekyllPage;
exports._getJekyllGuidelineData = getJekyllGuidelineData;
exports.getJekyllGuidelinePage = getJekyllGuidelinePage;
exports._getJekyllTopicData = getJekyllTopicData;
exports.getJekyllTopicPage = getJekyllTopicPage;
