const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const logger = require('./logger')
const publishToQueue = require('./send').publishToQueue;
var morgan = require('morgan')
require('dotenv').config();

const app = express();
const apiKey = process.env.API_KEY;

// HTTP Logging
app.use(morgan('combined'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS as view engine
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");


app.get('/', function (req, res, next) {

    res.render("index", {
        Weather: null,
        Population: null,
    });
})

// Route which handles the API call and renders the ejs file with weather data
app.post('/', async function (req, res, next) {
    // Retreive search location from request
    const searchLocation = req.body.location;
    if (!searchLocation) {
        res.status(400).send('Invalid Query');
        logger.warn('Invalid Search Location Query')
        return;
    }

    // compose URL for geolocation data api call
    let geocodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=1&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(geocodingURL);
        // Storing any data that will need to be sent back or to be used in next request
        let locationData = response.data[0];
        let city = locationData.name;
        let state = locationData.state;
        let country = locationData.country;
        let lat = locationData.lat;
        let lon = locationData.lon;

        // compose URL for weather info based off lat and long cordin
        let currWeatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        data = await axios.get(currWeatherURL);
        const weatherData = data.data;
        // OpenWeather API only returns rain data if there has been any rain in the past hour
        let rain = ((typeof weatherData.rain !== "undefined") ? weatherData.rain['1h'] : 'none');

        // Rendering index.ejs with weather info passed in
        res.render('index',
            {
                Weather: weatherData,
                City: city,
                State: state,
                Country: country,
                Description: weatherData.weather[0].description,
                Temp: weatherData.main.temp,
                FeelsLike: weatherData.main.feels_like,
                TempMax: weatherData.main.temp_max,
                TempMin: weatherData.main.temp_min,
                Humidity: weatherData.main.humidity,
                Rain: rain,
            });

        // Publish query to queue
        const queueName = 'location';
        const message = {
            city: city
        };
        await publishToQueue(queueName, message);

    } catch (error) {
        console.log(error)
        // logger.error(error);
        res.status(500).send('Something went wrong');
    }
})

app.post('/population', async function (req, res, next) {

    const populationApi = 'http://localhost:4000/population';
    // Axios HTTP request config
    const config = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }
    // Retreive search location from request
    const searchLocation = req.body.location;
    if (!searchLocation) {
        res.status(400).send('Invalid Query');
        logger.warn('Invalid Search Location Query')
        return;
    }
    // Composing POST body
    const data = new URLSearchParams({
        location: searchLocation
    })

    axios.post(populationApi, data, config)
        .then(function (response) {
            let population = response.data.population;

            res.status(200).send({
                City: searchLocation,
                Population: population
            })
        })
        .catch(function (error) {
            logger.error(error);
            res.sendStatus(400);
        });
})
module.exports = app;