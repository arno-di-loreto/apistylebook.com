'use strict';

const chai = require('chai');
const expect = chai.expect;
const jekyll = require('../lib/jekyll');

describe('jekyll', function() {
  describe('getJekyllPage', function() {
    it('should return a jekyll page with simple data', function() {
      const layout = 'guideline';
      const title = 'A Title';
      const permalink = '/link';
      const fields = {
        field: 'value'
      };
      const content = 'some content';
      const expected = '---\n' +
                       'layout: guideline\n' +
                       'title: A Title\n' +
                       'permalink: /link\n' +
                       'field: value\n' +
                       '---\n' +
                       'some content';
      const result = jekyll._getJekyllPage(
        layout, title, permalink, fields, content);
      expect(result).to.be.equal(expected);
    });

    it('should return a jekyll page with complex data', function() {
      const layout = 'guideline';
      const title = 'A Title';
      const permalink = '/link';
      const fields = {complex: {some: 'data'}};
      const content = 'some content';
      const expected = '---\n' +
                       'layout: guideline\n' +
                       'title: A Title\n' +
                       'permalink: /link\n' +
                       'complex:\n' +
                       '  some: data\n' +
                       '---\n' +
                       'some content';
      const result = jekyll._getJekyllPage(
        layout, title, permalink, fields, content);
      expect(result).to.be.equal(expected);
    });
  });

  describe('getJekyllGuidelineData', function() {
    const guideline = {
      id: 'cisco-api-design-guide',
      title: 'API Design Guide',
      type: 'github',
      url: 'https://github.com/CiscoDevNet/api-design-guide',
      company: 'Cisco',
      companyLogoUrl: '/media/logos/cisco.png',
      companyUrl: 'http://developer.cisco.com/',
      date: '2015-08-21T00:00:00.000Z',
      reviewDate: '2016-08-18T00:00:00.000Z',
      _links: {
        self: {
          href: '/design/guidelines/cisco-api-design-guide'
        },
        guidelineTopics: {
          href: '/design/guidelines/cisco-api-design-guide/topics'
        }
      }
    };
    const guidelineTopics = {
      items: [
        {
          references: [{some: 'data'}],
          _embedded: {
            topic: {
              id: 'collection-pagination',
              category: 'Collection Resources',
              name: 'Pagination',
              description: 'How to',
              _links: {
                self: {
                  href: '/link'
                }
              }
            }
          },
          _links: {
            some: 'links'
          }
        }
      ],
      _embedded: {
        guideline: guideline
      },
      _links: {
        some: 'links'
      }
    };
    let jdata;
    it('should run withour error', function() {
      try {
        jdata = jekyll._getJekyllGuidelineData(guidelineTopics);
      }
      catch (error) {
        expect(error, 'unexpected error').to.be.equal(undefined);
      }
    });

    it('should return jekyll data', function() {
      expect(jdata.layout).to.be.equal('guideline');
      expect(jdata.permalink).to.be.equal(guideline._links.self.href);
      expect(jdata.title).to.be.equal(guideline.title);
    });

    it('should return sort data in fields', function() {
      expect(jdata.fields.sort)
        .to.be.equal(guideline.company + '_' + guideline.title);
    });

    it('should return guideline data except links in fields', function() {
      for (let property in guideline) {
        if (property.localeCompare('_links') === 0) {
          expect(jdata.fields['guideline_' + property]).to.be.equal(undefined);
        }
        else {
          expect(jdata.fields['guideline_' + property])
            .to.be.equal(guideline[property]);
        }
      }
    });

    it('should return all references in fields.topics', function() {
      expect(jdata.fields.topics.length)
        .to.be.equal(guidelineTopics.items.length);
      for (let i = 0; i < guidelineTopics.items.length; i++) {
        expect(guidelineTopics.items[i].references)
          .to.be.eql(jdata.fields.topics[i].references);
      }
    });

    it('should return topic data in fields.topics', function() {
      for (let i = 0; i < guidelineTopics.items.length; i++) {
        const topic = guidelineTopics.items[i]._embedded.topic;
        const jTopic = jdata.fields.topics[i];
        for (let property in topic) {
          expect(topic[property]).to.be.eql(jTopic['topic_' + property]);
        }
      }
    });
  });

  describe('getJekyllGuidelinePage', function() {
    it('should return a guideline page', function() {
      const guideline = {
        id: 'cisco-api-design-guide',
        title: 'API Design Guide',
        type: 'github',
        url: 'https://github.com/CiscoDevNet/api-design-guide',
        company: 'Cisco',
        companyLogoUrl: '/media/logos/cisco.png',
        companyUrl: 'http://developer.cisco.com/',
        date: '2015-08-21T00:00:00.000Z',
        reviewDate: '2016-08-18T00:00:00.000Z',
        _links: {
          self: {
            href: '/design/guidelines/cisco-api-design-guide'
          },
          guidelineTopics: {
            href: '/design/guidelines/cisco-api-design-guide/topics'
          }
        }
      };
      const guidelineTopics = {
        items: [
          {
            references: [{some: 'data'}],
            _embedded: {
              topic: {
                id: 'collection-pagination',
                category: 'Collection Resources',
                name: 'Pagination',
                description: 'How to',
                _links: {
                  self: {
                    href: '/link'
                  }
                }
              }
            },
            _links: {
              some: 'links'
            }
          }
        ],
        _embedded: {
          guideline: guideline
        },
        _links: {
          some: 'links'
        }
      };
      const jdata = jekyll._getJekyllGuidelineData(guidelineTopics);
      const result = jekyll.getJekyllGuidelinePage(guidelineTopics);
      const expected = jekyll._getJekyllPage(
        jdata.layout,
        jdata.title,
        jdata.permalink,
        jdata.fields);
      expect(result).to.be.equal(expected);
    });
  });

  describe('getJekyllTopicData', function() {
    const topic = {
      id: 'a-topic',
      name: 'A Topic',
      category: 'cat',
      description: 'A description',
      _links: {
        self: {
          href: '/design/topics/a-topic'
        }
      }
    };
    const topicGuidelines = {
      items: [
        {
          references: [{some: 'data'}],
          _embedded: {
            guideline: {
              id: 'cisco-api-design-guide',
              title: 'API Design Guide',
              type: 'github',
              url: 'https://github.com/CiscoDevNet/api-design-guide',
              company: 'Cisco',
              companyLogoUrl: '/media/logos/cisco.png',
              companyUrl: 'http://developer.cisco.com/',
              date: '2015-08-21T00:00:00.000Z',
              reviewDate: '2016-08-18T00:00:00.000Z',
              _links: {
                self: {
                  href: '/design/guidelines/cisco-api-design-guide'
                },
                guidelineTopics: {
                  href: '/design/guidelines/cisco-api-design-guide/topics'
                }
              }
            }
          },
          _links: {
            some: 'links'
          }
        }
      ],
      _embedded: {
        topic: topic
      }
    };

    let jdata;
    it('should run without error', function() {
      try {
        jdata = jekyll._getJekyllTopicData(topicGuidelines);
      }
      catch (error) {
        expect(error, 'unexpected error').to.be.equal(undefined);
      }
    });

    it('should return jekyll data', function() {
      expect(jdata.layout).to.be.equal('topic');
      expect(jdata.permalink).to.be.equal(topic._links.self.href);
      expect(jdata.title).to.be.equal(topic.name);
    });

    it('should return sort data in fields', function() {
      expect(jdata.fields.sort)
        .to.be.equal(topic.category + '_' + topic.name);
    });

    it('should return topic data except links in fields', function() {
      for (let property in topic) {
        if (property.localeCompare('_links') === 0) {
          expect(jdata.fields['topic_' + property]).to.be.equal(undefined);
        }
        else {
          expect(jdata.fields['topic_' + property])
            .to.be.equal(topic[property]);
        }
      }
    });

    it('should return all references in fields.topics', function() {
      expect(jdata.fields.guidelines.length)
        .to.be.equal(topicGuidelines.items.length);
      for (let i = 0; i < topicGuidelines.items.length; i++) {
        expect(topicGuidelines.items[i].references)
          .to.be.eql(jdata.fields.guidelines[i].references);
      }
    });

    it('should return topic data in fields.topics', function() {
      for (let i = 0; i < topicGuidelines.items.length; i++) {
        const topic = topicGuidelines.items[i]._embedded.topic;
        const jGuideline = jdata.fields.guidelines[i];
        for (let property in topic) {
          expect(topic[property])
            .to.be.eql(jGuideline['guideline_' + property]);
        }
      }
    });
  });

  describe('getJekyllTopicPage', function() {
    it('should return a topic page', function() {
      const topic = {
        id: 'a-topic',
        name: 'A Topic',
        category: 'cat',
        description: 'A description',
        _links: {
          self: {
            href: '/design/topics/a-topic'
          }
        }
      };
      const topicGuidelines = {
        items: [
          {
            references: [{some: 'data'}],
            _embedded: {
              guideline: {
                id: 'cisco-api-design-guide',
                title: 'API Design Guide',
                type: 'github',
                url: 'https://github.com/CiscoDevNet/api-design-guide',
                company: 'Cisco',
                companyLogoUrl: '/media/logos/cisco.png',
                companyUrl: 'http://developer.cisco.com/',
                date: '2015-08-21T00:00:00.000Z',
                reviewDate: '2016-08-18T00:00:00.000Z',
                _links: {
                  self: {
                    href: '/design/guidelines/cisco-api-design-guide'
                  },
                  guidelineTopics: {
                    href: '/design/guidelines/cisco-api-design-guide/topics'
                  }
                }
              }
            },
            _links: {
              some: 'links'
            }
          }
        ],
        _embedded: {
          topic: topic
        }
      };
      const jdata = jekyll._getJekyllTopicData(topicGuidelines);
      const result = jekyll.getJekyllTopicPage(topicGuidelines);
      const expected = jekyll._getJekyllPage(
        jdata.layout,
        jdata.title,
        jdata.permalink,
        jdata.fields);
      expect(result).to.be.equal(expected);
    });
  });
});
