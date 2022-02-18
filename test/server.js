const app = require("../app.js");

const supertest = require('supertest');
const request = supertest(app);
const expect = require('chai').expect;

describe('GET /', () => {
    it('GET route should respond with 200', async () => {
        const response = await request.get('/')
        expect(response.text).to.not.be.empty;
        expect(response.status).equal(200);
    })
})

describe('POST /', () => {
    it('POST route return weather info of city requestd', async () => {
        const response = await request.post('/')
        .send('location=melbourne');
        
        expect(response.status).equal(200);
        expect(response.text).to.not.be.empty;
        let body = response.text;
        let result = body.includes('Melbourne');
        expect(result).equal(true);
    })
})