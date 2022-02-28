const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PopMin = process.env.POP_MIN || 4000;
const PopMax = process.env.POP_MAX || 100000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate a random population value
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Route which handles the API call and renders the ejs file with weather data
app.post('/population', function(req,res, next){
    // Retreive search location from request
    const searchLocation = req.body.location;
    if (!searchLocation) {
        res.status(400).send('Invalid Query');
        return;
    }
    const rndPop = randomIntFromInterval(PopMin, PopMax);

    // return population data
    res.send({
        city: searchLocation,
        population: rndPop
    })
})

module.exports = app;