function getWeather() {
    const apiKey = '2c03fd51b81317d7bf9d5eb49d0ad32b';
    const city = document.getElementById('city').value;
    
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p>${temperature}℃</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        weatherIcon.style.display = 'block';
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    const next24Hours = hourlyData.slice(0, 8); // Fetch the next 24 hours (8 time points with 3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}℃</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}



function addScrollFunctionality() {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Enable smooth scrolling
    hourlyForecastDiv.style.scrollBehavior = 'smooth';

    // Horizontal scroll using mouse wheel
    hourlyForecastDiv.addEventListener('wheel', (event) => {
        event.preventDefault();
        hourlyForecastDiv.scrollLeft += event.deltaY;
    });

    // Implement touch swipe for scrolling
    let startX;
    let scrollLeft;

    hourlyForecastDiv.addEventListener('touchstart', (event) => {
        startX = event.touches[0].pageX - hourlyForecastDiv.offsetLeft;
        scrollLeft = hourlyForecastDiv.scrollLeft;
    });

    hourlyForecastDiv.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const x = event.touches[0].pageX - hourlyForecastDiv.offsetLeft;
        const walk = x - startX;
        hourlyForecastDiv.scrollLeft = scrollLeft - walk;
    });
}

// Call the function after DOM loads
document.addEventListener('DOMContentLoaded', addScrollFunctionality);
