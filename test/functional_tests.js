const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);

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

    test('Handle missing id & new id generation', done => {
      done();
    });
    test('POST valid url & id', done => {
      done();
    });
    test('POST existing id', done => {
      done();
    });
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
