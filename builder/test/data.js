'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const mock = require('mock-fs');
const dlib = require('../lib/data');
const yaml = require('js-yaml');

describe('data', function() {
  describe('getGuidelines', function() {
    before(function() {
      const mocks = {
        'custom/path': {
          'one.yaml': 'some: custom value one',
          'two.yaml': 'some: custom value two'
        }
      };
      const defaultPath =
        path.join(__dirname, '..', '..', 'data', 'design', 'guidelines');
      mocks[defaultPath] = {
        'one.yaml': 'some: default value one',
        'two.yaml': 'some: default value two'
      };
      mock(mocks);
    });

    after(function() {
      mock.restore();
    });

    it('should load custom guidelines', function() {
      try {
        const guidelines = dlib.getGuidelines('custom/path');
        expect(guidelines.length).to.be.equal(2);
        expect(guidelines[0].some).to.be.equal('custom value one');
        expect(guidelines[1].some).to.be.equal('custom value two');
      }
      catch (error) {
        console.log(error);
        expect(error).to.be.equal(null);
      }
    });

    it('should load default guidelines', function() {
      try {
        const guidelines = dlib.getGuidelines();
        expect(guidelines.length).to.be.equal(2);
        expect(guidelines[0].some).to.be.equal('default value one');
        expect(guidelines[1].some).to.be.equal('default value two');
      }
      catch (error) {
        console.log(error);
        expect(error).to.be.equal(null);
      }
    });
  });

  describe('_getTopicsFromGuidelines', function() {
    it('should handle empty topics', function() {
      const guidelines = [
        {
          id: 'some-guideline',
          title: 'some guideline title',
          type: 'guideline-type',
          url: 'http://guideline.com/guidelines/index.html',
          company: 'Guidline & Co',
          companyLogoUrl: 'http://guideline.com/logo.png',
          companyUrl: 'http://guideline.com',
          date: '2016-08-15'
        }
      ];
      expect(dlib._getTopicsFromGuidelines(guidelines)).to.be.eql({});
    });

    it('should handle new topic', function() {
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
              'some reference'
            ]
          }
        }
      ];
      const map = dlib._getTopicsFromGuidelines(guidelines);
      expect(map.hasOwnProperty('topic')).to.be.eql(true);
      expect(map.topic.guidelines[0].id).to.be.equal(guidelines[0].id);
      expect(map.topic.guidelines[0]
        .references).to.be.equal(guidelines[0].topics.topic);
    });

    it('should handle existing topic', function() {
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
              'some reference'
            ]
          }
        },
        {
          id: 'another-guideline',
          title: 'another guideline title',
          type: 'another-guideline-type',
          url: 'http://another-guideline.com/guidelines/index.html',
          company: 'Another Guidline & Co',
          companyLogoUrl: 'http://another-guideline.com/logo.png',
          companyUrl: 'http://another-guideline.com',
          date: '2014-08-15',
          reviewDate: '2014-08-16',
          topics: {
            topic: [
              'another reference'
            ]
          }
        }
      ];
      const map = dlib._getTopicsFromGuidelines(guidelines);
      expect(map.topic.guidelines[0].references)
        .to.be.eql(guidelines[0].topics.topic);
      expect(map.topic.guidelines[1].references)
        .to.be.eql(guidelines[1].topics.topic);
    });
  });

  describe('getTopicsRaw', function() {
    before(function() {
      const mocks = {
        'custom/path': {
          'topics.yaml': 'some: custom value'
        }
      };
      const defaultPath = path.join(__dirname, '..', '..', 'data', 'design');
      mocks[defaultPath] =
        {'topics.yaml': 'some: default value'};
      mock(mocks);
    });

    after(function() {
      mock.restore();
    });

    it('should load custom topics.yaml file', function() {
      try {
        const topics = dlib._getTopicsRaw('custom/path/topics.yaml');
        expect(topics.some).to.be.equal('custom value');
      }
      catch (error) {
        console.log(error);
        expect(error).to.be.equal(null);
      }
    });

    it('should load default topics.yaml file', function() {
      try {
        const topics = dlib._getTopicsRaw();
        expect(topics.some).to.be.equal('default value');
      }
      catch (error) {
        console.log(error);
        expect(error).to.be.equal(null);
      }
    });
  });

  describe('getTopicsFromObject', function() {

    it('should return topics ids and their references', function() {
      const topicsRaw = {
        topic: {}
      };

      const guidelines = [{
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
      }];
      const topics = dlib._getTopicsFromObject(topicsRaw, guidelines);
      expect(topics.length).to.be.equal(1);
      expect(topics[0].id).equal('topic');
      expect(topics[0].guidelines.length).to.be.equal(1);
      expect(topics[0].guidelines[0].id).to.be.equal('some-guideline');
      expect(topics[0].guidelines[0].references)
        .to.be.equal(guidelines[0].topics.topic);
    });

    it('should return all topis properties', function() {
      const topicsRaw = {
        topic: {
          name: 'a name',
          description: 'a description',
          category: 'a category',
          zorglub: 'a zorglub'
        }
      };

      const guidelines = [{
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
      }];

      const topics = dlib._getTopicsFromObject(topicsRaw, guidelines);
      expect(topics.length).to.be.equal(1);
      for (let name in topicsRaw.topic) {
        expect(topics[0][name]).equal(topicsRaw.topic[name]);
      }
    });

    it('should throw error on unknown topic', function() {
      const topicsRaw = {
        topic: {
          name: 'A topic',
          description: 'Topic description'
        }
      };

      const guidelines = [{
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
          notopic: [
            {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
          ]
        }
      }];
      let err;
      try {
        dlib._getTopicsFromObject(topicsRaw, guidelines);
      }
      catch (error) {
        err = error;
      }
      expect(err).to.be.not.equal(undefined);
      expect(err.message).to.be.equal('Undefined topic notopic');
    });

    it('should throw error on unused topic', function() {
      const topicsRaw = {
        topic: {
          name: 'A topic',
          description: 'Topic description'
        },
        unused: {
          name: 'A unused topic',
          description: 'Unused topic description'
        }
      };

      const guidelines = [{
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
      }];
      let err;
      try {
        dlib._getTopicsFromObject(topicsRaw, guidelines);
      }
      catch (error) {
        err = error;
      }
      expect(err).to.be.not.equal(undefined);
      expect(err.message).to.be.equal('Unused topic unused');
    });
  });

  describe('getTopics', function() {
    const topicsFile = {
      topic: {
        name: 'A topic',
        description: 'Topic description'
      }
    };

    const guidelineFile = {
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
    };

    before(function() {
      const mocks = {
        'custom/topics.yaml':
          yaml.dump(topicsFile, {noRefs: true, lineWidth: -1}),
        'custom/path/guideline.yaml':
          yaml.dump(guidelineFile, {noRefs: true, lineWidth: -1})
      };
      mock(mocks);
    });

    after(function() {
      mock.restore();
    });

    it('should load topics and their references', function() {
      const topics = dlib.getTopics('custom/topics.yaml', 'custom/path');
      expect(topics.length).to.be.equal(1);
      expect(topics[0].id).equal('topic');
      expect(topics[0].name).equal(topicsFile.topic.name);
      expect(topics[0].description).equal(topicsFile.topic.description);
      expect(topics[0].guidelines.length).to.be.equal(1);
      expect(topics[0].guidelines[0].id).to.be.equal('some-guideline');
    });
  });

  describe('getGuideline', function() {
    it('should return guideline for its id', function() {
      const guidelines = [
        {id: 'some-id', some: 'value'}
      ];
      expect(dlib.getGuideline('some-id', guidelines)).to.be.eql(guidelines[0]);
    });

    it('should return undefined if no matching id', function() {
      const guidelines = [
        {id: 'some-id', some: 'value'}
      ];
      expect(dlib.getGuideline('some-bad-id', guidelines))
        .to.be.equal(undefined);
    });
  });

  describe('getTopic', function() {
    it('should return topic for its id', function() {
      const topics = [
        {id: 'some-id', some: 'value'}
      ];
      expect(dlib.getTopic('some-id', topics)).to.be.eql(topics[0]);
    });

    it('should return undefined if no matching id', function() {
      const topics = [
        {id: 'some-id', some: 'value'}
      ];
      expect(dlib.getTopic('some-bad-id', topics)).to.be.equal(undefined);
    });
  });
});
