require('dotenv').config()
const express = require('express');
const request = require('request-promise-native');
const cors = require('cors');
const date = require('date-and-time')
const app = express();
const lat = process.env.LAT;
const lng = process.env.LON;
const apiKey = process.env.OPENWEATHER_API_KEY;
const port = process.env.PORT || 8080;

app.use(cors());
let geocode, respForecast;

const getLatAndLng = async () => {
  const geoApiUri = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lng}&units=metric&lang=es`;
  return {
    data: await request({ uri: geoApiUri, json: true })
  };
};

const getForecast = async() => {
  const forecastUri = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${lat}&lon=${lng}&units=metric&lang=es`;
  respForecast = await request({ uri: forecastUri, json: true });
  console.log(respForecast);
  return {
    data: await request({uri: forecastUri, json: true})
  };
};

const getData = async(data) => {
  const result = [];
  data.map(d => {
    result.push({
      time: d.dt,
      precipIntensity: d.humidity,
      temperature: d.temp,
      icon: `http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`
    });
  });
  return result;
};

app.get('/api/forecast', async (req, res) => {

  const objDate = new Date();

  if (objDate.getMinutes() == 0) 
    getForecast();

  forecast = {
    location: geocode.name,
    time: date.format(new Date(),'DD-MM-YYYY HH:mm:ss'),
    daily: {
      data: [ 
        {
          icon: `http://openweathermap.org/img/wn/${geocode.weather[0].icon}@2x.png`,
          temperature: geocode.main.temp,
          summary: geocode.weather[0].description,
          temperatureMin: geocode.main.temp_min,
          temperatureMax: geocode.main.temp_max
        }
      ]
    },
    hourly: {
      data: await getData(respForecast.hourly)
    }
  };
  res.json(forecast);
});

app.listen(port, () => {

  getLatAndLng().then(response => {
    geocode = response.data;
  }).catch(error => {
    console.log(error);
  });

  getForecast().then(response => {
    respForecast = response.data;
  }).catch(error => {
    console.log(error);
  });

  console.log(`Listening on port ${port}`);
});
