const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { count } = require('console');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname,"public"));
app.set("view engine", "ejs");

app.get('/', function(req,res) {

    res.render("index", {
        Weather: null,
    });
})

app.post('/', async function(req,res){
    const searchLocation = req.body.location;
    let geocodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=1&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(geocodingURL);
        let locationData = response.data[0];
        let city = locationData.name;
        let state = locationData.state;
        let country = locationData.country;
        let lat = locationData.lat;
        let lon = locationData.lon;
        let currWeatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        data = await axios.get(currWeatherURL);
        const weatherData = data.data;
        let rain = ((typeof weatherData.rain !== "undefined") ? weatherData.rain['1h'] : 'none');

        res.render('index', {
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

    } catch (error) {
        console.log(error.response);
    }
    
})

app.listen(PORT, () => 
    console.log("App listening on port 3000!")
)

