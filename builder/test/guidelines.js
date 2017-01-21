'use strict';

const chai = require('chai');
const expect = chai.expect;
const glib = require('../lib/guidelines');
const tlib = require('../lib/topics');
const mock = require('mock-fs');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const jekyll = require('../lib/jekyll');

describe('guidelines', function() {
  describe('getApiGuidelineTopics', function() {
    let apiGuidelineTopics;
    const guideline = {
      id: 'some-guideline',
      topics: {
        atopic: [
          {name: 'a name', url: 'http://guideline.com/guidelines/index.html#reference'}
        ]
      }
    };
    const topics = [
      {
        id: 'atopic',
        name: 'A Topic',
        description: 'A topic description'
      }
    ];
    before(function() {
      apiGuidelineTopics = glib
        ._getApiGuidelineTopics('http://test.com', '.json', guideline, topics);
    });
    it('should return self and guideline links', function() {
      expect(apiGuidelineTopics._links.self.href)
        .to.be.equal('http://test.com/design/guidelines/some-guideline/topics.json');
      expect(apiGuidelineTopics._links.guideline.href)
        .to.be.equal('http://test.com/design/guidelines/some-guideline.json');
    });

    it('should return items', function() {
      expect(apiGuidelineTopics.items.length).to.be.equal(1);
      expect(apiGuidelineTopics.items[0].references)
        .to.be.equal(guideline.topics.atopic);
      expect(apiGuidelineTopics.items[0]._embedded.topic)
        .to.be.eql(tlib.getApiTopic('http://test.com', '.json', topics[0]));
    });
  });

  describe('getApiGuideline', function() {
    describe('reviewed guideline', function() {
      const guideline = {
        id: 'some-guideline',
        title: 'some guideline title',
        type: 'guideline-type',
        url: 'http://guideline.com/guidelines/index.html',
        company: 'Guidline & Co',
        companyLogoUrl: 'http://guideline.com/logo.png',
        companyUrl: 'http://guideline.com',
        date: '2016-08-15',
        reviewDate: '2016-08-16',
        zorglub: 'some zorglub data',
        topics:
        {
          topic: [
            {
              name: 'a name',
              url: 'http://guideline.com/guidelines/index.html#reference',
              quote: 'a quote'
            }
          ]
        }
      };

      let apiguideline;
      it('should run without error and return result', function() {
        try {
          apiguideline =
            glib.getApiGuideline('http://test.com', '.json', guideline);
        }
        catch (error) {
          expect(error, 'unexpected error').to.be.equal(undefined);
        }
        expect(apiguideline, 'unexpected undefined result')
          .to.be.not.equal(undefined);
      });

      it('should return all guideline properties except topics', function() {
        for (let property in guideline) {
          if ( property.localeCompare('topics') === 0) {
            expect(apiguideline[property], 'unexpected topics property')
              .to.be.equal(undefined);
          }
          else {
            expect(apiguideline[property], 'unexpected value for ' + property)
              .to.be.eql(guideline[property]);
          }
        }
      });

      it('should return self and guidelineTopics links',
      function() {
        expect(apiguideline._links.self.href,
          'self link')
            .to.be.equal(
              'http://test.com/design/guidelines/some-guideline.json');
        expect(apiguideline._links.guidelineTopics.href,
          'guidelineTopics link')
            .to.be.equal(
              'http://test.com/design/guidelines/some-guideline/topics.json');
      });
    });

    describe('unreviewed guideline', function() {
      const guideline = {
        id: 'some-guideline',
        title: 'some guideline title',
        type: 'guideline-type',
        url: 'http://guideline.com/guidelines/index.html',
        company: 'Guidline & Co',
        companyLogoUrl: 'http://guideline.com/logo.png',
        companyUrl: 'http://guideline.com',
        date: '2016-08-15'
      };

      let apiguideline;
      it('should run without error and return result', function() {
        try {
          apiguideline =
            glib.getApiGuideline('http://test.com', '.json', guideline);
        }
        catch (error) {
          expect(error, 'unexpected error').to.be.equal(undefined);
        }
        expect(apiguideline, 'unexpected undefined result')
          .to.be.not.equal(undefined);
      });

      it('should return all guideline properties', function() {
        for (let property in guideline) {
          expect(apiguideline[property], 'unexpected value for ' + property)
            .to.be.eql(guideline[property]);
        }
      });

      it('should return self link',
      function() {
        expect(apiguideline._links.self.href,
          'self link')
            .to.be.equal(
              'http://test.com/design/guidelines/some-guideline.json');
      });

      it('should not return guidelineTopics links if no topics and review date',
      function() {
        const apiguideline =
          glib.getApiGuideline('http://test.com', '.json', guideline);
        expect(apiguideline._links.guidelineTopics, 'guidelineTopics link')
          .to.be.equal(undefined);
      });
    });
  });

  describe('getApiGuidelines', function() {
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
        date: '2014-08-15'
      }
    ];

    const result = glib._getApiGuidelines('http://test.com', '.json', guidelines);

    it('should return self and design links', function() {
      expect(result._links.self.href, 'list self link').to.be.equal('http://test.com/design/guidelines.json');
      expect(result._links.design.href, 'list design link').to.be.equal('http://test.com/design.json');
    });

    it('should return guidelines data', function() {
      for (let i = 0; i < result.items; i++) {
        expect(result.items[i]).to.be.eql(glib.getApiGuideline('http://test.com', '.json', guidelines[i]));
      }
    });
  });

  describe('saveApiGuidelines', function() {
    const rootdir = '/path';
    const rooturl = 'http://test.com';
    const formats = ['.json', '.yaml'];
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
        date: '2014-08-15'
      }
    ];

    const topics = {
      topic: {
        name: 'Topic',
        description: 'Description'
      }
    };

    const glibJson = glib._getApiGuidelines(rooturl, '.json', guidelines);
    const glibYaml = glib._getApiGuidelines(rooturl, '.yaml', guidelines);

    before(function() {
      mock({
        '/path': {}
      });
    });

    after(function() {
      mock.restore();
    });

    it('should save api guideline without error', function() {
      try {
        glib._saveApiGuidelines(rootdir, rooturl, formats, guidelines);
      }
      catch (error) {
        console.log(error);
        expect(error, 'unexpected error while saving guidelines')
          .to.be.equal(null);
      }
    });

    it('should save guidelines as a json file', function() {
      let jsonFile;
      try {
        jsonFile = JSON.parse(
          fs.readFileSync(
            path.join(rootdir, 'guidelines.json'), 'utf8'));
      }
      catch (error) {
        expect(error, 'unexpected error when checking guidelines.json file')
          .to.be.equal(null);
      }
      expect(jsonFile, 'invalid json file content')
        .to.be.eql(glibJson);
    });

    it('should save guidelines as a yaml file', function() {
      let yamlFile;
      try {
        yamlFile = yaml.safeLoad(
          fs.readFileSync(
            path.join(rootdir, 'guidelines.yaml'), 'utf8'));
      }
      catch (error) {
        expect(error, 'unexpected error when checking guidelines.yaml file')
          .to.be.equal(null);
      }
      expect(yamlFile, 'invalid yaml file content')
        .to.be.eql(glibYaml);
    });

    it('should save all guidelines json files', function() {
      for (let i = 0; i < guidelines.length; i++) {
        let jsonFile;
        try {
          jsonFile = JSON.parse(
            fs.readFileSync(
              path.join(
                rootdir,
                'guidelines',
                guidelines[i].id + '.json'), 'utf8'));
        }
        catch (error) {
          expect(error,
            'unexpected error when checking ' + guidelines[i].id + '.json file')
            .to.be.equal(null);
        }
        expect(jsonFile, 'invalid json file content')
          .to.be.eql(
            glib.getApiGuideline(rooturl, '.json', guidelines[i], topics));
      }
    });

    it('should save all guidelines yaml files', function() {
      for (let i = 0; i < guidelines.length; i++) {
        let yamlFile;
        try {
          yamlFile = yaml.safeLoad(
            fs.readFileSync(
              path.join(
                rootdir,
                'guidelines',
                guidelines[i].id + '.yaml'), 'utf8'));
        }
        catch (error) {
          expect(error,
            'unexpected error when checking ' + guidelines[i].id + '.yaml file')
            .to.be.equal(null);
        }
        expect(yamlFile, 'invalid yaml file content')
          .to.be.eql(glib.getApiGuideline(
            rooturl, '.yaml', guidelines[i], topics));
      }
    });
  });

  describe('saveApiGuidelinesTopics', function() {
    const rootdir = '/path';
    const rooturl = 'http://test.com';
    const formats = ['.json', '.yaml', 'jekyll'];
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
        date: '2014-08-15'
      }
    ];

    const topics = [
      {
        id: 'topic',
        name: 'Topic',
        description: 'Description'
      }
    ];

    before(function() {
      mock({
        '/path': {}
      });
    });

    after(function() {
      mock.restore();
    });

    it('should save api guidelines topics without error', function() {
      try {
        glib._saveApiGuidelinesTopics(
          rootdir, rooturl, formats, guidelines, topics);
      }
      catch (error) {
        expect(error, 'unexpected error while saving guidelines topics')
          .to.be.equal(null);
      }
    });

    it('should save guidelines topics as json files', function() {
      for (let i = 0; i < guidelines.length; i++) {
        let jsonFile;
        try {
          jsonFile = JSON.parse(
            fs.readFileSync(
              path.join(
                rootdir,
                'guidelines',
                guidelines[i].id,
                'topics.json'), 'utf8'));
        }
        catch (error) {
          expect(error,
            'unexpected error when checking ' +
            guidelines[i].id +
            'topics.json file')
            .to.be.equal(null);
        }
        expect(jsonFile, 'invalid json file content')
          .to.be.eql(
            glib._getApiGuidelineTopics(
              rooturl, '.json', guidelines[i], topics));
      }
    });

    it('should save guidelines topics as yaml files', function() {
      for (let i = 0; i < guidelines.length; i++) {
        let yamlFile;
        try {
          yamlFile = yaml.safeLoad(
            fs.readFileSync(
              path.join(
                rootdir,
                'guidelines',
                guidelines[i].id,
                'topics.yaml'), 'utf8'));
        }
        catch (error) {
          expect(error,
            'unexpected error when checking ' +
            guidelines[i].id +
            '/topics.yaml file')
            .to.be.equal(null);
        }
        expect(yamlFile, 'invalid yaml file content')
          .to.be.eql(glib._getApiGuidelineTopics(
            rooturl, '.yaml', guidelines[i], topics));
      }
    });

    it('should save jekyll guidelines', function() {
      for (let i = 0; i < guidelines.length; i++) {
        let jekyllFile;
        try {
          const filename = path.join(
                rootdir,
                'guidelines',
                guidelines[i].id + '-topics.md');
          jekyllFile = fs.readFileSync(filename, 'utf8');
        }
        catch (error) {
          expect(error,
            'unexpected error when checking ' +
            guidelines[i].id +
            '.md file')
            .to.be.equal(null);
        }
        expect(jekyllFile, 'invalid yaml file content')
          .to.be.eql(
            jekyll.getJekyllGuidelinePage(
              glib._getApiGuidelineTopics(
                rooturl, '', guidelines[i], topics)));
      }
    });
  });

  describe('save', function() {
    const rootdir = '/path';
    const rooturl = 'http://test.com';
    const formats = ['.json', '.yaml', 'jekyll'];
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
        date: '2014-08-15'
      }
    ];

    const topics = [
      {
        id: 'topic',
        name: 'Topic',
        description: 'Description'
      }
    ];

    before(function() {
      mock({
        '/path': {}
      });
    });

    after(function() {
      mock.restore();
    });

    it('should save api guidelines and guidelines topics without error',
    function() {
      try {
        glib.save(rootdir, rooturl, formats, guidelines, topics);
      }
      catch (error) {
        console.log(error);
        expect(error, 'unexpected error while saving guidelines topics')
          .to.be.equal(null);
      }
    });
  });
});
