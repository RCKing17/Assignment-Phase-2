const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');  // Import your server
const assert = require('assert');

chai.use(chaiHttp);
const should = chai.should();

describe('Server API Routes', () => {
  it('should GET /api/users', (done) => {
    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('should POST /api/user', (done) => {
    const user = { name: 'TestUser', email: 'test@test.com' };
    chai.request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('name').eql('TestUser');
        done();
      });
  });
});
describe('Server Tests', () => {
  it('should return 200 on GET / route', (done) => {
    assert.equal(true, true);  // Example assertion, replace with actual test logic
    done();
  });
});
