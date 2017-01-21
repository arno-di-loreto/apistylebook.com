'use strict';

const chai = require('chai');
const expect = chai.expect;
const tlib = require('../lib/topics');
const glib = require('../lib/guidelines');
const mock = require('mock-fs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const jekyll = require('../lib/jekyll');

const rooturl = 'http://test.com';
const rootdir = '/path';
const jsonFormat = '.json';
const yamlFormat = '.yaml';
const jekyllFormat = 'jekyll';
const formats = [jsonFormat, yamlFormat, jekyllFormat];

describe('topics', function() {
  describe('getApiTopic', function() {
    const topic = {
      id: 'sometopic',
      category: 'some category',
      name: 'some topic name',
      description: 'some topic description',
      zorglub: 'a zorglub'
    };
    let apiTopic;
    it('should run without error and return data', function() {
      try {
        apiTopic =
          tlib.getApiTopic(rooturl, jsonFormat, topic);
      }
      catch (error) {
        expect(error).to.be.equal(undefined);
      }
      expect(apiTopic).to.be.not.equal(undefined);
    });

    it('should return all topic properties except guidelines', function() {
      for (let property in topic) {
        if (property.localeCompare('guidelines') === 0) {
          expect(apiTopic[property], 'unexpected guidelines property')
            .to.be.equal(undefined);
        }
        else {
          expect(apiTopic[property], 'unexpected value for ' + property)
            .to.be.equal(topic[property]);
        }
      }
    });

    it('should return links', function() {
      expect(apiTopic._links.self.href,
             'topic should have a correct self link')
        .to.be.equal(rooturl + '/design/topics/' + topic.id + '.json');
      expect(apiTopic._links.topicGuidelines.href,
             'topic should have a correct guidelines link')
        .to.be.equal(
          rooturl + '/design/topics/' + topic.id + '/guidelines.json');
    });
  });

  describe('getApiTopics', function() {
    it('should return empty items and links', function() {
      const topics = {};
      const apiTopics = tlib._getApiTopics(rooturl, jsonFormat, topics);
      expect(apiTopics.items.length, 'should have an empty items array')
        .to.be.equal(0);
      expect(apiTopics._links.self.href,
             'should had a self link with .json extension')
        .to.be.equal(rooturl + '/design/topics.json');
      expect(apiTopics._links.design.href,
             'should had a design link with .json extension')
        .to.be.equal(rooturl + '/design.json');
    });

    it('should return topic data and links', function() {
      const topics = [
        {
          id: 'sometopic',
          name: 'some topic name',
          description: 'some topic description',
          category: 'a category'
        }
      ];
      const apiTopics = tlib._getApiTopics(rooturl, jsonFormat, topics);
      expect(apiTopics.items.length, 'should have one topic in items')
        .to.be.equal(1);
      expect(apiTopics.items[0], 'incorrect topic data')
        .to.be.eql(tlib.getApiTopic(
          rooturl, jsonFormat, topics[0]));
    });
  });

  describe('saveApiTopics', function() {
    const sourcetopics = [
      {id: 'topic1', name: 'Topic 1', description: 'Topic 1 description'},
      {id: 'topic2', name: 'Topic 2', description: 'Topic 2 description'}
    ];
    let apitopicsJson;
    let apitopicsYaml;

    before(function() {
      mock({
        '/path': {}
      });
      apitopicsJson = tlib._getApiTopics(rooturl, jsonFormat, sourcetopics);
      apitopicsYaml = tlib._getApiTopics(rooturl, yamlFormat, sourcetopics);
    });

    after(function() {
      mock.restore();
    });

    it('should save topics list and details without error', function() {
      try {
        tlib._saveApiTopics(
          rootdir, rooturl, formats, sourcetopics);
      }
      catch (error) {
        expect(error, 'unexpected error when saving api topics')
            .to.be.equal(null);
      }
    });

    it('should save topics.json', function() {
      let jsonFile;
      try {
        jsonFile = JSON.parse(
          fs.readFileSync(
            path.join(rootdir, 'topics.json'), 'utf8'));
      }
      catch (error) {
        expect(error, 'unexpected error when checking topics.json file')
          .to.be.equal(null);
      }
      expect(jsonFile, 'invalid json file content').to.be.eql(apitopicsJson);
    });

    it('should save topics.yaml', function() {
      let yamlFile;
      try {
        yamlFile = yaml.safeLoad(
          fs.readFileSync(
            path.join(rootdir, 'topics.yaml'), 'utf8'));
      }
      catch (error) {
        expect(error, 'unexpected error when checking topics.yaml file')
          .to.be.equal(null);
      }
      expect(yamlFile, 'invalid yaml file content').to.be.eql(apitopicsYaml);
    });

    it('should save all topics as json', function() {
      for (let i = 0; i < sourcetopics.length; i++) {
        const sourcetopic = sourcetopics[i];

        const jsonFilename =
          path.join(rootdir, 'topics', sourcetopic.id + jsonFormat);
        let jsonFile;
        try {
          jsonFile = JSON.parse(fs.readFileSync(jsonFilename), 'utf8');
        }
        catch (error) {
          expect(error, 'unexpected error when checking topic.json file')
            .to.be.equal(null);
        }
        expect(jsonFile, 'invalid json file content')
          .to.be.eql(apitopicsJson.items[i]);
      }
    });

    it('should save all topics as yaml', function() {
      for (let i = 0; i < sourcetopics.length; i++) {
        const sourcetopic = sourcetopics[i];

        const yamlFilename =
          path.join(rootdir, 'topics', sourcetopic.id + '.yaml');
        let yamlFile;
        try {
          yamlFile = yaml.safeLoad(fs.readFileSync(yamlFilename, 'utf8'));
        }
        catch (error) {
          expect(error, 'unexpected error when checking topic.yaml file')
            .to.be.equal(null);
        }
        expect(yamlFile, 'invalid json file content')
          .to.be.eql(apitopicsYaml.items[i]);
      }
    });
  });

  describe('getApiTopicGuidelines', function() {
    const guidelines = [
      {
        id: 'some-guideline',
        title: 'some guideline title',
        type: 'guideline-type',
        url: 'http://guideline.com/guidelines/index.html',
        company: 'Guidline & Co',
        companyLogoUrl: 'http://guideline.com/logo.png',
        companyUrl: 'http://guideline.com',
        date: '2016-08-15',
        reviewDate: '2016-08-16',
        topics: {
          topic: [
            {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
          ]
        }
      }
    ];
    const topic = {
      id: 'topic',
      guidelines: [
        {
          id: 'some-guideline',
          references: [
            {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
          ]
        }
      ]
    };
    const apiTopicGuidelines =
      tlib._getApiTopicGuidelines(
        rooturl, jsonFormat, topic, guidelines);

    it('should return list with self and topic links', function() {
      expect(apiTopicGuidelines._links.self.href, 'invalid self link')
        .to.be.equal(
          rooturl + '/design/topics/' + topic.id + '/guidelines.json');
      expect(apiTopicGuidelines._links.topic.href, 'invalid topic link')
        .to.be.equal(rooturl + '/design/topics/' + topic.id + '.json');
    });

    it('should return list with embedded topic', function() {
      expect(apiTopicGuidelines._embedded.topic, 'invalid embedded topic')
        .to.be.eql(tlib.getApiTopic(rooturl, jsonFormat, topic));
    });

    it('should return guidelines references referencing topic', function() {
      expect(apiTopicGuidelines.items[0].references)
        .to.be.eql(topic.guidelines[0].references);
    });

    it('should return embedded guideline with self and guidelineTopics links',
    function() {
      expect(apiTopicGuidelines.items[0]._embedded.guideline, 'guideline')
        .to.be.eql(glib.getApiGuideline(rooturl, jsonFormat, guidelines[0]));
    });
  });

  describe('saveApiTopicsGuidelines', function() {
    const guidelines = [
      {
        id: 'some-guideline',
        title: 'some guideline title',
        type: 'guideline-type',
        url: 'http://guideline.com/guidelines/index.html',
        company: 'Guidline & Co',
        companyLogoUrl: 'http://guideline.com/logo.png',
        companyUrl: 'http://guideline.com',
        date: '2016-08-15',
        reviewDate: '2016-08-16',
        topics: {
          topic: {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
        }
      }
    ];

    const topics = [{
      id: 'topic',
      name: 'Topic',
      description: 'Description',
      guidelines: [
        {
          id: 'some-guideline',
          references: [
            {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
          ]
        }
      ]
    }];

    let apitopicGuidelinesJson = [];
    let apitopicGuidelinesYaml = [];
    let apitopicGuidelinesJekyll = [];

    before(function() {
      mock({
        '/path': {}
      });
      for (let i = 0; i < topics.length; i++) {
        apitopicGuidelinesJson.push(tlib._getApiTopicGuidelines(
          rooturl, jsonFormat, topics[i], guidelines));
        apitopicGuidelinesYaml.push(tlib._getApiTopicGuidelines(
          rooturl, yamlFormat, topics[i], guidelines));
        apitopicGuidelinesJekyll.push(tlib._getApiTopicGuidelines(
          rooturl, '', topics[i], guidelines));
      }
    });

    after(function() {
      mock.restore();
    });

    it('should save api topics guidelines without error', function() {
      try {
        tlib._saveApiTopicsGuidelines(
          rootdir, rooturl, formats, topics, guidelines);
      }
      catch (error) {
        expect(error, 'unexpected error while saving topics guidelines')
          .to.be.equal(null);
      }
    });

    it('should save topics guidelines as json files', function() {
      for (let i = 0; i < topics.length; i++) {
        const jsonFilename =
          path.join(rootdir, 'topics', topics[i].id, 'guidelines' + jsonFormat);
        let jsonFile;
        try {
          jsonFile = JSON.parse(fs.readFileSync(jsonFilename), 'utf8');
        }
        catch (error) {
          console.log(error);
          expect(error, 'unexpected error when checking guidelines.json file')
            .to.be.equal(null);
        }
        expect(jsonFile, 'invalid json file content')
          .to.be.eql(apitopicGuidelinesJson[i]);
      }
    });

    it('should save topics guidelines as yaml files', function() {
      for (let i = 0; i < topics.length; i++) {
        const yamlFilename =
          path.join(rootdir, 'topics', topics[i].id, 'guidelines' + yamlFormat);
        let yamlFile;
        try {
          yamlFile = yaml.safeLoad(fs.readFileSync(yamlFilename, 'utf8'));
        }
        catch (error) {
          console.log(error);
          expect(error, 'unexpected error when checking topic.yaml file')
            .to.be.equal(null);
        }
        expect(yamlFile, 'invalid yaml file content')
          .to.be.eql(apitopicGuidelinesYaml[i]);
      }
    });

    it('should save topics guidelines as jekyll files', function() {
      for (let i = 0; i < topics.length; i++) {
        const jekyllFilename =
          path.join(rootdir, 'topics', topics[i].id + '-guidelines.md');
        let jekyllFile;
        try {
          jekyllFile = fs.readFileSync(jekyllFilename, 'utf8');
        }
        catch (error) {
          console.log(error);
          expect(error, 'unexpected error when checking topic.yaml file')
            .to.be.equal(null);
        }
        expect(jekyllFile, 'invalid jekyll file content')
          .to.be.equal(jekyll.getJekyllTopicPage(apitopicGuidelinesJekyll[i]));
      }
    });
  });

  describe('save', function() {
    const guidelines = [
      {
        id: 'some-guideline',
        title: 'some guideline title',
        type: 'guideline-type',
        url: 'http://guideline.com/guidelines/index.html',
        company: 'Guidline & Co',
        companyLogoUrl: 'http://guideline.com/logo.png',
        companyUrl: 'http://guideline.com',
        date: '2016-08-15',
        reviewDate: '2016-08-16',
        topics: {
          topic: {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
        }
      }
    ];

    const topics = [{
      id: 'topic',
      guidelines: [
        {
          id: 'some-guideline',
          references: [
            {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
          ]
        }
      ]
    }];

    let apitopicsJson;
    let apitopicsYaml;
    let apitopicGuidelinesJson = [];
    let apitopicGuidelinesYaml = [];

    before(function() {
      mock({
        '/path': {}
      });
      apitopicsJson = tlib._getApiTopics(rooturl, jsonFormat, topics);
      apitopicsYaml = tlib._getApiTopics(rooturl, yamlFormat, topics);
      for (let i = 0; i < topics.length; i++) {
        apitopicGuidelinesJson.push(tlib._getApiTopicGuidelines(
          rooturl, jsonFormat, topics[i], guidelines));
        apitopicGuidelinesYaml.push(tlib._getApiTopicGuidelines(
          rooturl, yamlFormat, topics[i], guidelines));
      }
    });

    it('should run without error', function() {
      try {
        tlib.save(rootdir, rooturl, formats, topics, guidelines);
      }
      catch (error) {
        expect(error,
          'unexpected error while saving topics & topics guidelines')
          .to.be.equal(null);
      }
    });

    after(function() {
      mock.restore();
    });
  });
});
