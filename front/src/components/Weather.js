import React from 'react';
import PropTypes from 'prop-types';
import HourWeather from './HourWeather';

const Weather = ({ time, city, icon, temperature, summary, tempMin, tempMax, hourly }) => {
  const bgColorClass = () => {
    let result;

    if (tempMax >= 30) {
      result = 'very-warm';
    }
    else if (tempMax >= 20 && tempMax < 30) {
      result = 'warm';
    }
    else if (tempMax > 10 && tempMax < 20) {
      result = 'normal';
    }
    else if (tempMax > 0 && tempMax < 10) {
      result = 'cold';
    }
    else if (tempMax <= 0) {
      result = 'very-cold';
    }

    return result;
  }

  return (
    <div className={"container-fluid weather " + bgColorClass()}>
      <div className="row justify-content-center">
        <div className="col-4">
          <div className="city">{city}</div>
          <div className="last-find">{time}</div>
        </div>
        <div className="col-2">
          <div className="icon-today">
            <img src={icon} width="50" height="50" alt="weather_img" />
          </div>
        </div>
        <div className="col text-center">
          <div className="actual-temp">&nbsp;{temperature}</div>
        </div>
        <div className="col text-right">
          <div className="temp">min&nbsp;{tempMin}&deg;C</div>
          <div className="temp">max&nbsp;{tempMax}&deg;C</div>
        </div>
      </div>
      <hr/>
      <div className="row justify-content-center">
        {hourly.data.slice(1,8).map((object, i) => <div className="col-xs" style={{padding: '3px'}} key={object.time}><HourWeather data={object} /></div>)}
      </div>
      <div className="row">
        <div className="col text-center">
          <div className="summary">{summary}</div>
        </div>
      </div>
    </div>
  );
};

Weather.propTypes = {
  lastFind: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  tempMin: PropTypes.number.isRequired,
  tempMax: PropTypes.number.isRequired,
  hourly: PropTypes.object.isRequired
}

export default Weather;
