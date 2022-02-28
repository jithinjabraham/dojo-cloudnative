const app = require("../app.js");

const supertest = require('supertest');
const request = supertest(app);
const expect = require('chai').expect;

describe('POST /population', () => {
    it('POST route should respond with 400 for empty query', async () => {
        const response = await request.post('/population')
        .send('location=');
        
        expect(response.status).equal(400);
        expect(response.text).equal('Invalid Query');
    })
})

describe('POST /population', () => {
    it('POST route should return 200 and population info of city requested', async () => {
        const response = await request.post('/population')
        .send('location=melbourne');
        
        expect(response.status).equal(200);
        expect(response.text).to.not.be.empty;
        let body = response.text;
        let result = body.includes('melbourne');
        expect(result).equal(true);
    })
})