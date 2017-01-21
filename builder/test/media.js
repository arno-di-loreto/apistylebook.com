'use strict';

const chai = require('chai');
const expect = chai.expect;
const mock = require('mock-fs');
const fs = require('fs');

const media = require('../lib/media');

describe('media', function() {
  describe('getWebshotOptions', function() {
    it('should return default options', function() {
      expect(media._getWebshotOptions()).to.be.eql({
        screenSize: {width: 1280, height: 800},
        shotSize: {width: 1280, height: 800}
      });
    });

    it('should return custom options', function() {
      expect(media._getWebshotOptions(123, 456)).to.be.eql({
        screenSize: {width: 123, height: 456},
        shotSize: {width: 123, height: 456}
      });
    });
  });

  describe('screenshot', function() {
    describe('screenshot OK', function() {
      this.timeout(15000);

      const filename = 'test.png';
      let error;
      before(function() {
        return media.screenshot('http://apihandyman.io', filename)
        .then(function() {
        })
        .catch(function(err) {
          error = err;
        });
      });

      it('should run without error', function() {
        expect(error, 'unexpected error').to.be.equal(undefined);
      });

      it('should save screenshot', function() {
        try {
          fs.unlinkSync(filename);
        }
        catch (error) {
          expect(error, 'unexpected error').to.be.equal(undefined);
        }
      });
    });

    describe('screenshot KO', function() {
      this.timeout(15000);

      const filename = 'test.png';
      let error;
      before(function() {
        return media.screenshot('http://localhost:6666', filename)
        .then(function() {
        })
        .catch(function(err) {
          error = err;
        });
      });

      it('should return an error', function() {
        expect(error, 'unexpected error').to.be.not.equal(undefined);
      });

      it('should not save screenshot', function() {
        try {
          fs.unlinkSync(filename);
        }
        catch (error) {
          expect(error, 'unexpected error').to.be.not.equal(undefined);
        }
      });
    });
  });

  describe('screenshotsItem', function() {
    describe('screenshotsItem OK', function() {
      this.timeout(15000);
      const data = {
        filename: 'test.png',
        url: 'http://apihandyman.io',
        width: 1024,
        height: 768
      };
      let error;
      let result;
      before(function(done) {
        media._screenshotsItem(data, function(err, res) {
          error = err;
          result = res;
          done();
        });
      });

      it('must return a result and no error', function() {
        expect(result).to.be.not.equal(undefined);
        expect(error).to.be.equal(null);
      });

      it('should save screenshot', function() {
        try {
          fs.unlinkSync(data.filename);
        }
        catch (error) {
          expect(error, 'unexpected error').to.be.equal(undefined);
        }
      });
    });

    describe('screenshotsItem KO', function() {
      this.timeout(15000);
      const data = {
        filename: 'test.png',
        url: 'http://localhost:6666',
        width: 1024,
        height: 768
      };
      let error;
      let result;
      before(function(done) {
        media._screenshotsItem(data, function(err, res) {
          error = err;
          result = res;
          done();
        });
      });

      it('must return a result and no error', function() {
        expect(result).to.be.not.equal(undefined);
        expect(error).to.be.equal(null);
      });

      it('should return error with data', function() {
        expect(result.error).to.be.not.equal(undefined);
        expect(result.error).to.be.not.equal(null);
      });
    });
  });

  describe('screenshots', function() {
    this.timeout(15000);
    const data1 = {
      filename: 'test.png',
      url: 'http://apihandyman.io',
      width: 1024,
      height: 768
    };
    const data2 = {
      filename: 'test2.png',
      url: 'http://localhost:6666',
      width: 1024,
      height: 768
    };
    const data = [data1, data2];
    let error;
    let result;
    before(function() {
      return media.screenshots(data)
      .then(function(res) {
        result = res;
      })
      .catch(function(err) {
        error = err;
      });
    });

    after(function() {
      try {
        fs.unlinkSync(data1.filename);
      }
      catch (error) {
      }
      try {
        fs.unlinkSync(data2.filename);
      }
      catch (error) {
      }
    });

    it('must return a result and no error', function() {
      expect(result).to.be.not.equal(undefined);
      expect(error).to.be.equal(undefined);
    });

    it('must return data for each screenshot', function() {
      expect(result.length).to.be.equal(data.length);
    });

    it('must return screenshot OK', function() {
      for (let i = 0; i < result.length; i++) {
        if (result[i].url.localeCompare(data1.url) === 0) {
          expect(result[i]).to.be.eql(data1);
        }
      }
    });

    it('must return screenshot KO', function() {
      for (let i = 0; i < result.length; i++) {
        if (result[i].url.localeCompare(data2.url) === 0) {
          expect(result[i].url).to.be.equal(data2.url);
          expect(result[i].filename).to.be.equal(data2.filename);
          expect(result[i].width).to.be.equal(data2.width);
          expect(result[i].height).to.be.equal(data2.height);
          expect(result[i].error).to.be.not.equal(undefined);
          expect(result[i].error).to.be.not.equal(null);
        }
      }
    });
  });

  describe('getGuidelinesScreenshotsTarget', function() {
    it('should return default when target not set', function() {
      expect(media._getGuidelinesScreenshotsTarget())
        .to.be.equal(media._TARGET);
    });

    it('should return target when target is set', function() {
      expect(media._getGuidelinesScreenshotsTarget('target'))
        .to.be.equal('target');
    });
  });

  describe('getGuidelinesScreenshots', function() {
    describe('OK', function() {
      this.timeout(15000);

      const guidelines = [
        {id: 'some-guideline', url: 'http://apihandyman.io'}
      ];

      let result;
      let error;
      before(function() {
        return media.getGuidelinesScreenshots(guidelines, '.')
        .then(function(res) {
          result = res;
        })
        .catch(function(err) {
          error = err;
        });
      });

      after(function() {
        try {
          fs.unlinkSync('some-guideline.png');
        }
        catch (error) {
        }
      });

      it('should never go in catch', function() {
        expect(error, 'unexpected catch on promise').to.be.equal(undefined);
      });

      it('should always go in then and return something', function() {
        expect(result, 'no then or no result').to.be.not.equal(undefined);
      });

      it('should not return error in result', function() {
        for (let i = 0; i < result.length; i++) {
          expect(result[i].error, 'unexpected error in result')
            .to.be.equal(undefined);
        }
      });

      it('should have created all screenshots', function() {
        for (let i = 0; i < guidelines.length; i++) {
          try {
            fs.unlinkSync(guidelines[i].id + '.png');
          }
          catch (error) {
            expect(error, 'file do not exists').to.be.equal(undefined);
          }
        }
      });
    });
  });
});

