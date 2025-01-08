// API

const locationApiUrl = 'https://geocoding-api.open-meteo.com/v1/search?';
const weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';
const wmoCodeApiUrl = 'https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json';

// DOM elements

const body = document.body;
const h1 = document.getElementById("title");
const h2 = document.getElementById("location");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");
const darkModeToggle = document.getElementById("darkModeToggle");

// Dark Mode/Light Mode toggle button

document.getElementById("darkModeToggle").addEventListener("click", function toggleDarkMode() {
    body.classList.toggle("darkMode");
    h1.classList.toggle("h1DarkMode");
    searchInput.classList.toggle("searchDarkMode");
    searchBtn.classList.toggle("searchBtnDarkMode");
    weatherContainer.classList.toggle("weather-containerDarkMode");
    darkModeToggle.classList.toggle("darkModeToggleDarkMode");
    const buttonText = function () {
        if (darkModeToggle.className === "darkModeToggleDarkMode") {
            return darkModeToggle.innerHTML = "Light Mode";
        } else {
            return darkModeToggle.innerHTML = "Dark Mode";
        }
    };
    darkModeToggle.innerHTML = buttonText();
})

// Functin to convert location to coordinates
async function geoLocation(location) {
    try {
        const geoResponse = await fetch(`${locationApiUrl}name=${location}&count=1&language=en`);
        const geoData = await geoResponse.json();
        // console.log(geoData.results[0]);
        return getWeather(geoData.results[0]);
    } catch (error) {
        console.error("error");
    }
}

// Function to get weather data
async function getWeather(location) {
    try {
        const weatherResponse = await fetch(`${weatherApiUrl}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code`);
        const weatherData = await weatherResponse.json();
        // console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.error("error");
    }
}

// Function to get weather image
async function getWeatherImage(weatherCode) {
    try {
        const wmoCodeFetch = await fetch(`${wmoCodeApiUrl}`);
        const wmoCodeData = await wmoCodeFetch.json();
        const weatherDescription = await wmoCodeData[weatherCode];
        const weather = weatherDescription.day.image;
        console.log(weather);
        return weather;
    } catch (error) {
        console.error("error");
    }
}

// Function to render weather data
async function renderWeather(weatherData) {
    try {
        weatherContainer.innerHTML = '';
        h2.innerHTML = searchInput.value;
        weatherData.daily.time.forEach(async (time, index) => {
            const dayData = weatherData.daily;
            const maxTemp = dayData.temperature_2m_max[index];
            const minTemp = dayData.temperature_2m_min[index];
            const weatherCode = dayData.weather_code[index];
            const precipitation = dayData.precipitation_sum[index];
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            const weatherImage = await getWeatherImage(weatherCode);
            console.log(weatherImage);
            dayElement.innerHTML = `
                <img src="${weatherImage}" alt="Weather icon">
                <h3>${new Date(time).toLocaleDateString()}</h3>
                <p>Max: ${maxTemp}°C</p>
                <p>Min: ${minTemp}°C</p>
                <p>Precipitation: ${precipitation}mm</p>
            `;
            weatherContainer.appendChild(dayElement);
        });
    } catch (error) {
        console.error("error");
    }

}


// Search button click
searchBtn.addEventListener('click', async () => {
    const location = searchInput.value;
    const weatherData = await geoLocation(location);
    renderWeather(weatherData);
})

// Search on enter
searchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value;
        const weatherData = await geoLocation(location);
        renderWeather(weatherData);
    }
})