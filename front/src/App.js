import React, { Component } from 'react';
import './App.css';
import Weather from './components/Weather.js';
import 'bootstrap/dist/css/bootstrap.css';
require('dotenv').config();
const port = process.env.PORT || 8080;

class App extends Component {
  state = {
    forecast: null,
    isLoading: true,
    error: null
  };

  componentDidMount() {
    setInterval(() => this.callForecastApi().then(response => {
      this.setState({
        forecast: response,
        isLoading: false
      })}), 
    1000);
  }

  callForecastApi = async () => {
    const response = await fetch(`http://localhost:${port}/api/forecast`);
    const body = await response;

    if (response.status !== 200) throw Error('Error occured during fetching the forecast');
    return body.json();
  };

  render() {
    const { forecast, isLoading, error } = this.state;

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
        time={forecast.time}
        city={forecast.location}
        icon={forecast.daily.data[0].icon}
        temperature={forecast.daily.data[0].temperature}
        summary={forecast.daily.data[0].summary}
        tempMin={Math.round(forecast.daily.data[0].temperatureMin)}
        tempMax={Math.round(forecast.daily.data[0].temperatureMax)}
        hourly={forecast.hourly}
      />
    );
  }
}

export default App;