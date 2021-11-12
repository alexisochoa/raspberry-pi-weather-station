require('dotenv').config()
const express = require('express');
const request = require('request-promise-native');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;
let locationName;
let geocode;

const lat = process.env.LAT;
const lng = process.env.LON;
const apiKey = process.env.OPENWEATHER_API_KEY;

const getLatAndLng = async () => {
  const geoApiUri = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lng}&units=metric&lang=es`;
  return {
    data: await request({ uri: geoApiUri, json: true })
  }
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
}

app.get('/api/forecast', async (req, res) => {
  const forecastUri = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${lat}&lon=${lng}&units=metric&lang=es`;
  const respForecast = await request({ uri: forecastUri, json: true });
  const forecast = {
    daily: {
      data: [ 
        {
          icon: `http://openweathermap.org/img/wn/${geocode.weather[0].icon}@2x.png`,
          feelsLike: geocode.main.feels_like,
          pressure: geocode.main.pressure,
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

app.get('/api/air', async (req, res) => {
  const airlyUri = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`
  const pollutionResp = await request({ uri: airlyUri, json: true });
  pollution = {
    pollutionLevel: pollutionResp.list[0].main.aqi,
    pm25: pollutionResp.list[0].components.pm2_5,
    pm10: pollutionResp.list[0].components.pm10
  };
  res.json(pollution);
});

app.get('/api/location', (req, res) => {
  res.json({locationName});
});

app.listen(port, () => {
  getLatAndLng()
  .then(response => {
    locationName = response.data.name;
    geocode = response.data;
    console.log(`Listening on port ${port}`);
  })
  .catch(error => {
    console.log(error);
  });
});
