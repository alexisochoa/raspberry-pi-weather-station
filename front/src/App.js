import React, { Component } from 'react';
import './App.css';
import Weather from './components/Weather.js';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  state = {
    locationName: null,
    forecast: null,
    pollution: null,
    isLoading: true,
    error: null
  };

  componentDidMount() {
    Promise.all([
      this.callForeactApi(),
      this.callLocationApi(),
      this.callAirPollutionApi()
    ])
    .then(response => {
      console.log(response);
      this.setState({
        locationName: response[1].locationName,
        forecast: response[0],
        pollution: response[2],
        isLoading: false
      });
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }

  callForeactApi = async () => {
    const response = await fetch('http://localhost:8080/api/forecast');
    const body = await response;

    if (response.status !== 200) throw Error('Error occured during fetching the forecast');
    return body.json();
  };

  callAirPollutionApi = async () => {
    const response = await fetch('http://localhost:8080/api/air');
    const body = await response;

    if (response.status !== 200) throw Error('Error occured during fetching the air pollution');
    return body.json();
  };

  callLocationApi = async() => {
    const response = await fetch('http://localhost:8080/api/location');
    const body = await response;
    return body.json();
  };

  render() {
    const { locationName, forecast, pollution, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div class="vertical-center" >
          <div class="container">
            <div class="row">
              <div class="col">
                <div className="alert alert-primary text-center">
                  Loading ...
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div class="vertical-center" >
          <div class="container">
            <div class="row">
              <div class="col">
                <div className="alert alert-danger">
                  {error.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <Weather
        city={locationName}
        icon={forecast.daily.data[0].icon}
        feelsLike={forecast.daily.data[0].feelsLike}
        summary={forecast.daily.data[0].summary}
        tempMin={Math.round(forecast.daily.data[0].temperatureMin)}
        tempMax={Math.round(forecast.daily.data[0].temperatureMax)}
        hourly={forecast.hourly}
        pollutionLevel={pollution.pollutionLevel}
        pm25={Math.round(pollution.pm25)}
        pm10={Math.round(pollution.pm10)}
      />
    );
  }
}

export default App;
