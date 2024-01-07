document.addEventListener('DOMContentLoaded', function () {
    // Load search history from local storage and update the display
    displaySearchHistory();
    
    // Other initialization code...
});

    const searchButton = document.getElementById('searchButton');
    const weatherContainer = document.getElementById('weatherContainer');


    searchButton.addEventListener('click', function () {
        const cityInput = document.getElementById('cityInput').value;
        const apiKey = 'e8a37158bb12d8b3687730cbf80c6b6a';

        // Current weather API
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=imperial`;

        // Forecast API
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=imperial`;

        // Fetch current weather data
        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(currentData => {
                console.log(currentData);
                displayCurrentWeather(currentData);

                // Save the search to local storage
                saveToLocalStorage(cityInput);
                // Update the search history display
                displaySearchHistory();
            })
            .catch(error => {
                console.error('Error fethcing current weather data:', error);
                // Handle errors here
            });    
                

                

        // Fetch forecast data
        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                console.log(forecastData);
                displayWeatherForecast(forecastData);
                
                // Update the search history display
                displaySearchHistory();
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                // Handle errors here
            });
    });

    function saveToLocalStorage(city) {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
        // Check if the city is not already in the searchHistory array
        if (!searchHistory.includes(city)) {
            // Add the new search to the history array
            searchHistory.push(city);
            // Save the updated search history back to localStorage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }

// Function to display search history
function displaySearchHistory() {
    const searchHistoryContainer = document.getElementById('searchHistoryContainer');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Clear existing content in searchHistoryContainer
    searchHistoryContainer.innerHTML = '';

    // Display each search history item in a separate div
    searchHistory.forEach(city => {
        const historyItemHTML = `
            <div class="searchHistoryItem" data-city="${city}">
                ${city}
            </div>
        `;
        // Append the new div to searchHistoryContainer
        searchHistoryContainer.innerHTML += historyItemHTML;
    });

    // Add click event listener to each search history item
    const historyItems = document.querySelectorAll('.searchHistoryItem');
    historyItems.forEach(item => {
        item.addEventListener('click', function () {
            const selectedCity = this.getAttribute('data-city');
            // Trigger a new search with the selected city
            searchWithStoredCity(selectedCity);
        });
    });
}

    // Function to search with a stored city from search history
    function searchWithStoredCity(city) {
        const apiKey = 'e8a37158bb12d8b3687730cbf80c6b6a';

        // Current weather API
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        // Forecast API
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        // Fetch current weather data
        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(currentData => {
                console.log(currentData);
                displayCurrentWeather(currentData);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                // Handle errors here
            });

        // Fetch forecast data
        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                console.log(forecastData);
                displayWeatherForecast(forecastData);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                // Handle errors here
            });
    }


    function displayCurrentWeather(data) {
        const city = data.name;
        const currentDate = new Date().toLocaleDateString();
        const temperature = data.main.temp;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const weatherCondition = data.weather[0].main; // Assuming the main weather condition is in the first item of the 'weather' array
    
        // Map between weather conditions and icons
        const weatherIcons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Snow': '❄️',
            'Thunderstorm': '⛈️',
            'Drizzle': '🌦️',
            'Mist': '🌫️',
            'Fog': '🌁',
            
        };
    
        // Get the corresponding icon for the weather condition
        const weatherIcon = weatherIcons[weatherCondition] || '❓'; // Default to question mark if condition not found
    
        const currentWeatherHTML = `
            <div class="weatherInfo">
                <h2>${city} - Current Weather</h2>
                <p>Date: ${currentDate}</p>
                <p>Temperature: ${temperature} &#8451;</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
                <p>Condition: ${weatherCondition} ${weatherIcon}</p>
            </div>
        `;
    
        weatherContainer.innerHTML = currentWeatherHTML;
    }

    function displayWeatherForecast(data) {
        const forecastList = data.list;
    
        // Clear existing content in forecastContainer
        forecastContainer.innerHTML = '';
    
        // Get the current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
    
        // Track dates to avoid duplicates
        const displayedDates = [];
    
        // Display weather information for each day in a separate div
        for (let i = 0; i < forecastList.length; i++) {
            const forecastData = forecastList[i];
            const forecastDate = new Date(forecastData.dt * 1000);
    
            // Skip the current day
            if (forecastDate <= currentDate) {
                continue;
            }
    
            const dateKey = forecastDate.toLocaleDateString();
    
            // Check if the date has already been displayed
            if (!displayedDates.includes(dateKey)) {
                const date = forecastDate.toLocaleDateString();
                const temperature = forecastData.main.temp;
                const windSpeed = forecastData.wind.speed;
                const humidity = forecastData.main.humidity;
                const weatherCondition = forecastData.weather[0].main; // Assuming the main weather condition is in the first item of the 'weather' array
    
                // Map between weather conditions and icons
                const weatherIcons = {
                    'Clear': '☀️',
                    'Clouds': '☁️',
                    'Rain': '🌧️',
                    'Snow': '❄️',
                    'Thunderstorm': '⛈️',
                    'Drizzle': '🌦️',
                    'Mist': '🌫️',
                    'Fog': '🌁',
                    // Add more conditions and their corresponding icons as needed
                    // ...
                };
    
                // Get the corresponding icon for the weather condition
                const weatherIcon = weatherIcons[weatherCondition] || '❓'; // Default to question mark if condition not found
    
                const weatherHTML = `
                    <div class="weatherInfo">
                        <h2>${date}</h2>
                        <p>Temperature: ${temperature} &#8451;</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Condition: ${weatherCondition} ${weatherIcon}</p>
                    </div>
                `;
    
                // Append the new div to forecastContainer
                forecastContainer.innerHTML += weatherHTML;
    
                // Add the date to the displayedDates array
                displayedDates.push(dateKey);
    
                // Stop when 5 days are displayed
                if (displayedDates.length >= 5) {
                    break;
                }
            }
        }
    }