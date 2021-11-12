import React from 'react';
import PropTypes from 'prop-types';

const HourWeather = ({ data }) => {
  return (
    <div>
      {new Date(data.time * 1000).getHours()}:00
      <div className="icon-hourly">
        <img src={data.icon} width="50" height="50" alt="weather_img" />
      </div>
      <div>
        {Math.round(data.temperature)}&deg;C
      </div>
      <div>
        {Math.round(data.precipIntensity)}&nbsp;%
      </div>
    </div>
  );
};

HourWeather.propTypes = {
  data: PropTypes.object.isRequired
}

export default HourWeather;
