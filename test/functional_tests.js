const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

function postReq(url, body) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post(url)
    .set('content-type', 'application/json')
    .send(body)
    .end((err, res) => {
      if (!err && res) {
        resolve(res);
      } else {
        reject(err);
      }
    })
  });
}

function getHtmlLink(text) {
  const inputRegex = new RegExp('^.*(?=<input.*(value=".*".*id="shortenedlink")|(id="shortenedlink".*value=".*").*>).*$');
  const valueRegex = new RegExp('value="(.+\/shorten\/.{5})"');
  const inputMatch = inputRegex.exec(text)[1];
  const valueMatch = valueRegex.exec(inputMatch)[1];



  return { matched: valueMatch, id: valueMatch.substring(valueMatch.length - 5) };
}

suite('Functional Tests', () => {
  suite('POST request to /shorten', () => {
    // Validation Tests
    test('Handle missing url', done => {
      postReq('/shorten', {
        original_url: "",
        url_id: ""
      }).then(resp => {
        assert.equal(resp.body.error, 'Url is missing.', 'api didn\'t handle missing url');
        assert.equal(resp.statusCode, 400, 'api didn\'t send a 400 status');
        done();
      }).catch(err => done(err));;
    }).timeout(5000);
    test('Handle invalid url', done => {
      postReq('/shorten', {
        original_url: "thisisaninvalidurlhahahahah",
        url_id: ""
      }).then(resp => {
        assert.equal(resp.body.error, 'Invalid url.', 'api didn\'t handle invalid url');
        assert.equal(resp.statusCode, 400, 'api didn\'t send a 400 status');
        done();
      }).catch(err => done(err));;
    }).timeout(5000);
    test('Handle invalid id length', done => {
      postReq('/shorten', {
        original_url: "https://www.chaijs.com/",
        url_id: "704508734528075347083"
      }).then(resp => {
        assert.equal(resp.body.error, 'Id length must be 5.', 'api didn\'t handle invalid id length');
        assert.equal(resp.statusCode, 400, 'api didn\'t send a 400 status');
        done();
      }).catch(err => done(err));;
    }).timeout(5000);
    test('Handle non-alphanumeric id', done => {
      postReq('/shorten', {
        original_url: "https://en.wikipedia.org/wiki/Seleucus_VI_Epiphanes",
        url_id: "theo!"
      }).then(resp => {
        assert.equal(resp.body.error, 'Id must only contain alphanumeric characters.', 'api didn\'t handle non-alphanumeric id');
        assert.equal(resp.statusCode, 400, 'api didn\'t send a 400 status');
        done();
      }).catch(err => done(err));;
    }).timeout(5000);

    test('POST valid url & missing id', done => {
      postReq('/shorten', {
        original_url: "https://www.w3schools.com/js/default.asp", 
        url_id: ""
      }).then(resp => {
        const status = resp.statusCode;
        const htmlRes = resp.text;
        const extracted = getHtmlLink(htmlRes);

        assert.equal(status, 201, 'api didn\'t send a 201 status');
        assert.exists(extracted.id, 'api didn\'t generate an id');
        assert.exists(extracted.matched, 'api didn\'t create a shortened link');

        done();
      }).catch(err => done(err));
    }).timeout(8000);
    test('POST valid url & existing id', done => {
      const url_id = 'chai0';
      postReq('/shorten', {
        original_url: "https://www.chaijs.com/api/assert/#method_assert",
        url_id
      }).then(resp => {
        const status = resp.statusCode;
        const htmlRes = resp.text;
        const extracted = getHtmlLink(htmlRes);

        assert.equal(status, 201, 'api didn\'t send a 201 status');
        assert.equal(extracted.id, url_id, 'id is not equal to given id');
        assert.exists(extracted.matched, 'api didn\'t create a shortened link');
        
        done();
      }).catch(err => done(err));
    }).timeout(8000);
  });
  suite('GET request to /shorten/:url_id', () => {
    test('GET non-existing id', done => {
      chai.request(server)
      .get('/shorten/123456')
      .end((err, res) => {
        if (!err) {
          assert.equal(res.statusCode, 404, 'api didn\'t send a 404 status');
          done();
        } else {
          done(err);
        }
      });
    }).timeout(10000);
    test('GET existing id', done => {
      const original_url = 'https://github.com/Ry2uko',
      url_id = 'ry2uk'
      postReq('/shorten', { original_url, url_id }).then(() => {
        chai.request(server)
        .get(`/shorten/${url_id}`)
        .end((err, res) => {
          if (!err) {
            assert.equal(res.statusCode, 200, 'api didn\'t send a 200 status');
            done();
          } else {
            done(err);
          }
        });
      }).catch(err => done(err));
    }).timeout(10000);
  });
  suite('Misc', () => {
    test('GET non-existing route', done => {
      chai.request(server)
      .get('/non-existent')
      .end((err, res) => {
        if (!err) {
          assert.equal(res.statusCode, 404, 'server didn\'t send a 404 status');
          done();
        } else {
          done(err);
        }
      });
    }).timeout(5000);
    test('GET /', done => {
      chai.request(server)
      .get('/')
      .end((err, res) => {
        if (!err) {
          assert.exists(res.text, 'server didn\'t render home page');
          done();
        } else {
          done(err);
        }
      });
    }).timeout(5000);
  });
});
