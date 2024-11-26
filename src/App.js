import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import FavoriteCities from "./Feature2"; // Import your FavoriteCities component

function Grp204WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: [],
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  // Load favorite cities from localStorage on initial load
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  // Function to format the current date
  const toDateFunction = () => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const weekDays = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const currentDate = new Date();
    return `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
  };

  // Function to fetch weather data and forecast
  const search = async (city) => {
    if (!city) return; // Ensure city is valid
    setWeather({ ...weather, loading: true });

    const url = "https://api.openweathermap.org/data/2.5/weather";
    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const apiKey = "f00c38e0279b7bc85480c3fe775d518c";

    try {
      // Fetch current weather
      const currentRes = await axios.get(url, {
        params: {
          q: city,
          units: "metric",
          appid: apiKey,
        },
      });

      // Fetch 5-day forecast
      const forecastRes = await axios.get(forecastUrl, {
        params: {
          q: city,
          units: "metric",
          appid: apiKey,
        },
      });

      // Update weather and forecast data
      setWeather({
        data: currentRes.data,
        forecast: forecastRes.data.list.filter((_, index) => index % 8 === 0), // Get forecast data for every 8th entry (12 hours apart)
        loading: false,
        error: false,
      });
    } catch (error) {
      setWeather({ ...weather, data: {}, forecast: [], error: true });
    }
  };

  // Add city to favorites and update localStorage
  const addToFavorites = () => {
    if (input && !favorites.includes(input)) {
      const updatedFavorites = [...favorites, input];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Select a favorite city and load its weather data
  const selectFavoriteCity = (cityName) => {
    setInput(cityName);
    search(cityName); // Directly call search with the city name
  };

  // Handle key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form
      search(input); // Call search with the current input value
      setInput(""); // Clear input after searching
    }
  };

  // Function to remove a city from favorites
  const removeFromFavorites = (city) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress} // Handle key press for Enter key
        />
        <button onClick={addToFavorites}>Ajouter aux favoris</button>{" "}
        {/* Add to favorites */}
      </div>

      {/* Loading Spinner */}
      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}

      {/* Error Message */}
      {weather.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </div>
      )}

      {/* Weather Information */}
      {weather.data && weather.data.main && (
        <div className="weather-info">
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}

      {/* Display Favorite Cities */}
      <FavoriteCities
        favorites={favorites}
        selectFavoriteCity={selectFavoriteCity}
        removeFromFavorites={removeFromFavorites}
      />
    </div>
  );
}

export default Grp204WeatherApp;
