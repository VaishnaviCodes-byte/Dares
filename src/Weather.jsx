import React, { useState, useEffect } from "react";
import "./Weather.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // controls visibility

  const apikey = "c1ca27eb7c6a3585429ce5085bfbcde1";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

  // Get weather by coordinates
  const getWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(`${apiUrl}&lat=${lat}&lon=${lon}&appid=${apikey}`);
      if (response.status === 404) {
        setError(true);
        setWeatherData(null);
      } else {
        const data = await response.json();
        setWeatherData(data);
        setError(false);
      }
    } catch {
      setError(true);
      setWeatherData(null);
    }
  };

  // Get weather by city
  const checkWeather = async (cityName) => {
    try {
      const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apikey}`);
      if (response.status === 404) {
        setError(true);
        setWeatherData(null);
      } else {
        const data = await response.json();
        setWeatherData(data);
        setError(false);
      }
    } catch {
      setError(true);
      setWeatherData(null);
    }
  };

  // Get weather icon
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clouds":
        return "/assets/clouds.png";
      case "Rain":
        return "/assets/rain.png";
      case "Drizzle":
        return "/assets/drizzle.png";
      case "Mist":
        return "/assets/mist.png";
      case "Clear":
        return "/assets/clear.png";
      default:
        return "";
    }
  };

  // Detect user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => console.log("Geolocation denied. Please use search.")
      );
    }
  }, []);

  return (
    <div>
      {/* Weather Button (shows only when card is hidden) */}
      {!isOpen && (
        <div
          className="weather-btn"
          onClick={() => setIsOpen(true)}
          role="button"
          aria-label="Open weather card"
        >
          <img src="/assets/weather-logo.png" alt="Weather Logo" />
        </div>
      )}

      {/* Weather Card (shows only when isOpen is true) */}
      {isOpen && (
        <div className="weather-card">
          {/* Close Button */}
          <button className="weather-close" onClick={() => setIsOpen(false)}>
            ✖
          </button>

          {/* Search Bar */}
          <div className="weather-search">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => checkWeather(city)}>
              <img src="/assets/search.png" alt="search" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="weather-error">
              <p>Invalid City Name</p>
            </div>
          )}

          {/* Weather Display */}
          {weatherData && !error && (
            <div className="weather-display">
              <img
                className="weather-display-icon"
                src={getWeatherIcon(weatherData.weather[0].main)}
                alt="weather-icon"
              />
              <h1 className="weather-temp">{Math.round(weatherData.main.temp)}°C</h1>
              <h2 className="weather-city">{weatherData.name}</h2>
              <div className="weather-details">
                <div className="weather-col">
                  <img src="/assets/humidity.png" alt="humidity" />
                  <div>
                    <p className="weather-humidity">{weatherData.main.humidity}%</p>
                    <p>Humidity</p>
                  </div>
                </div>
                <div className="weather-col">
                  <img src="/assets/wind.png" alt="wind" />
                  <div>
                    <p className="weather-wind">{weatherData.wind.speed} km/hr</p>
                    <p>Wind Speed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
