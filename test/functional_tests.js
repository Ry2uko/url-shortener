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
      done();
    });
    test('Handle invalid url', done => {
      done();
    });
    test('Handle invalid id length', done => {
      done();
    });
    test('Handle non-alphanumeric id', done => {
      done();
    });

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
      done();
    });
    test('GET existing id', done => {
      done();
    });
  });
  suite('Misc', () => {
    test('GET non-existing route', done => {
      done();
    });
    test('GET /', done => {
      done();
    });
  });
});
