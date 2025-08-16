const weatherApiKey = '043a1061dfaf354493722f0c7a2a1e7c';
const city = 'Rotterdam';
const nasaApiKey = 'O0lD7RVokZYuVkSlTYioqKjeVE32ENMXcmoTrR0K';

async function getWeather() {
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherApiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        document.getElementById('temperature').textContent = Math.round(currentData.main.temp);
        document.getElementById('weather-description').textContent = currentData.weather[0].description;
        document.getElementById('humidity').textContent = currentData.main.humidity;
        document.getElementById('wind-speed').textContent = currentData.wind.speed;

        const iconCode = currentData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="${currentData.weather[0].description}">`;

        const forecastContainer = document.getElementById('forecast-container');
        const dailyForecasts = processForecastData(forecastData.list);
        forecastContainer.innerHTML = dailyForecasts.map(day => `
            <div class="forecast-day">
                <h3>${formatDate(day.date)}</h3>
                <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
                <div class="temp-range">
                    <span class="max-temp">${Math.round(day.maxTemp)}°C</span>
                    <div class="temp-bar">
                        <div class="temp-fill" style="width: ${getTempPercentage(day.minTemp, day.maxTemp)}%"></div>
                    </div>
                    <span class="min-temp">${Math.round(day.minTemp)}°C</span>
                </div>
                <p>${day.description}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('temperature').textContent = '--';
        document.getElementById('weather-description').textContent = 'Failed to load weather data';
        document.getElementById('humidity').textContent = '--';
        document.getElementById('wind-speed').textContent = '--';
        document.getElementById('forecast-container').innerHTML = '<p class="error">Failed to load forecast</p>';
    }
}

function processForecastData(forecastList) {
    const dailyData = {};
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                date: new Date(forecast.dt * 1000),
                minTemp: forecast.main.temp_min,
                maxTemp: forecast.main.temp_max,
                icon: forecast.weather[0].icon,
                description: forecast.weather[0].description
            };
        } else {
            dailyData[date].minTemp = Math.min(dailyData[date].minTemp, forecast.main.temp_min);
            dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, forecast.main.temp_max);
        }
    });
    return Object.values(dailyData).slice(1, 6);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function getTempPercentage(min, max) {
    return ((max - min) / max) * 100;
}

async function getISSLocation() {
    try {
        // Optie 1: Directe HTTPS API calls (meeste moderne browsers ondersteunen dit)
        const locationResponse = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const locationData = await locationResponse.json();
        
        const peopleResponse = await fetch('https://api.wheretheiss.at/v1/satellites/25544/crew');
        const peopleData = await peopleResponse.json();

        const speed = locationData.velocity; // km/s
        const lat = parseFloat(locationData.latitude);
        const lon = parseFloat(locationData.longitude);

        const now = new Date();
        const sunPosition = calculateSunPosition(now, lat, lon);
        const isDaylight = sunPosition > 0;

        const nextPass = calculateNextVisiblePass();

        const cryptoDiv = document.getElementById('iss-data');
        cryptoDiv.innerHTML = `
            <h2>ISS Tracker</h2>
            <div class="iss-map">
                <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-20},${lat-20},${lon+20},${lat+20}&layer=mapnik&marker=${lat},${lon}" style="filter: invert(90%) hue-rotate(180deg);"></iframe>
                <div class="iss-marker ${isDaylight ? 'daylight' : 'night'}">🛸</div>
            </div>
            <div class="iss-stats">
                <div class="iss-stat-item">
                    <div class="stat-circle">
                        <span class="stat-value">${(speed * 3600).toFixed(0)}</span>
                        <span class="stat-label">km/h</span>
                    </div>
                    <p>Current Speed</p>
                </div>
                <div class="iss-stat-item">
                    <div class="stat-circle">
                        <span class="stat-value">${peopleData.length}</span>
                        <span class="stat-label">crew</span>
                    </div>
                    <p>Astronauts</p>
                </div>
                <div class="iss-stat-item">
                    <div class="stat-circle ${isDaylight ? 'sun' : 'moon'}">
                        <span class="stat-icon">${isDaylight ? '☀️' : '🌙'}</span>
                    </div>
                    <p>${isDaylight ? 'Daylight' : 'Night'}</p>
                </div>
            </div>
            <div class="iss-crew">
                <h3>Current Crew</h3>
                <div class="crew-grid">
                    ${peopleData.map(person => `
                        <div class="crew-member">
                            <div class="astronaut-icon">👨‍🚀</div>
                            <p>${person.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="next-pass">
                <h3>Next Visible Pass</h3>
                <p>🔭 ${nextPass}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching ISS data:', error);
        
        // Fallback naar originele API met HTTPS CORS proxy
        try {
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const locationResponse = await fetch(`${corsProxy}http://api.open-notify.org/iss-now.json`);
            const locationData = await locationResponse.json();
            const peopleResponse = await fetch(`${corsProxy}http://api.open-notify.org/astros.json`);
            const peopleData = await peopleResponse.json();

            const speed = 7.66;
            const lat = parseFloat(locationData.iss_position.latitude);
            const lon = parseFloat(locationData.iss_position.longitude);

            const now = new Date();
            const sunPosition = calculateSunPosition(now, lat, lon);
            const isDaylight = sunPosition > 0;

            const nextPass = calculateNextVisiblePass();

            const cryptoDiv = document.getElementById('iss-data');
            cryptoDiv.innerHTML = `
                <h2>ISS Tracker</h2>
                <div class="iss-map">
                    <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-20},${lat-20},${lon+20},${lat+20}&layer=mapnik&marker=${lat},${lon}" style="filter: invert(90%) hue-rotate(180deg);"></iframe>
                    <div class="iss-marker ${isDaylight ? 'daylight' : 'night'}">🛸</div>
                </div>
                <div class="iss-stats">
                    <div class="iss-stat-item">
                        <div class="stat-circle">
                            <span class="stat-value">${(speed * 3600).toFixed(0)}</span>
                            <span class="stat-label">km/h</span>
                        </div>
                        <p>Current Speed</p>
                    </div>
                    <div class="iss-stat-item">
                        <div class="stat-circle">
                            <span class="stat-value">${peopleData.number}</span>
                            <span class="stat-label">crew</span>
                        </div>
                        <p>Astronauts</p>
                    </div>
                    <div class="iss-stat-item">
                        <div class="stat-circle ${isDaylight ? 'sun' : 'moon'}">
                            <span class="stat-icon">${isDaylight ? '☀️' : '🌙'}</span>
                        </div>
                        <p>${isDaylight ? 'Daylight' : 'Night'}</p>
                    </div>
                </div>
                <div class="iss-crew">
                    <h3>Current Crew</h3>
                    <div class="crew-grid">
                        ${peopleData.people.filter(person => person.craft === 'ISS').map(person => `
                            <div class="crew-member">
                                <div class="astronaut-icon">👨‍🚀</div>
                                <p>${person.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="next-pass">
                    <h3>Next Visible Pass</h3>
                    <p>🔭 ${nextPass}</p>
                </div>
            `;
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            document.getElementById('iss-data').innerHTML = `
                <h2>ISS Tracker</h2>
                <p class="error">Failed to load ISS data</p>
            `;
        }
    }
}

function calculateSunPosition(date, lat, lon) {
    const hour = date.getUTCHours() + (lon / 15);
    return Math.sin((hour - 12) / 12 * Math.PI);
}

function calculateNextVisiblePass() {
    const date = new Date();
    date.setHours(date.getHours() + Math.floor(Math.random() * 24));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

async function getSpaceInfo() {
    try {
        const factResponse = await fetch('https://api.le-systeme-solaire.net/rest/bodies/earth');
        const planetData = await factResponse.json();
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = `
            <h2>Space Explorer</h2>
            <div class="content-item space-fact">
                <h3>🌍 Earth Facts</h3>
                <p>Average Temperature: ${planetData.avgTemp}°K</p>
                <p>Gravity: ${planetData.gravity} m/s²</p>
                <p>Escape Velocity: ${(planetData.escape/1000).toFixed(1)} km/s</p>
                <p>Length of Year: ${planetData.sideralOrbit} Earth days</p>
            </div>
            <div class="content-item space-fact">
                <h3>🌠 Did You Know?</h3>
                <ul>
                    <li>The ISS travels at approximately 7.66 kilometers per second</li>
                    <li>A day on Earth is actually 23 hours, 56 minutes, and 4 seconds</li>
                    <li>The Sun's light takes about 8 minutes to reach Earth</li>
                </ul>
            </div>
            <div class="content-item space-fact">
                <h3>🚀 Space Milestones</h3>
                <p>Next Full Moon: ${getNextFullMoon()}</p>
                <p>Next Meteor Shower: ${getNextMeteorShower()}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching space info:', error);
        document.getElementById('news-container').innerHTML = `
            <h2>Space Explorer</h2>
            <p class="error">Failed to load space information</p>
        `;
    }
}

function getNextFullMoon() {
    const today = new Date();
    const lastFullMoon = new Date('2024-03-25');
    const lunarMonth = 29.53059 * 24 * 60 * 60 * 1000;
    const nextFullMoon = new Date(lastFullMoon.getTime());
    while (nextFullMoon <= today) {
        nextFullMoon.setTime(nextFullMoon.getTime() + lunarMonth);
    }
    return nextFullMoon.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getNextMeteorShower() {
    const meteorShowers = [
        { name: 'Lyrids', peak: '2024-04-22' },
        { name: 'Eta Aquarids', peak: '2024-05-05' },
        { name: 'Perseids', peak: '2024-08-12' },
        { name: 'Geminids', peak: '2024-12-14' }
    ];
    const today = new Date();
    const nextShower = meteorShowers.find(shower => new Date(shower.peak) > today);
    if (nextShower) {
        const date = new Date(nextShower.peak);
        return `${nextShower.name} (${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})`;
    }
    return 'Loading...';
}

async function getNASAImage() {
    try {
        console.log('Fetching NASA APOD...');
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`);
        console.log('NASA API Response:', response.status);
        const data = await response.json();
        console.log('NASA Data:', data);

        const nasaContent = document.getElementById('nasa-content');
        if (!nasaContent) {
            console.error('NASA content element not found! Make sure you have an element with id="nasa-content"');
            return;
        }

        if (data.media_type === 'video') {
            nasaContent.innerHTML = `
                <h3>${data.title}</h3>
                <div class="nasa-video-container">
                    <iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p class="nasa-description">${data.explanation}</p>
            `;
        } else {
            nasaContent.innerHTML = `
                <h3>${data.title}</h3>
                <div class="nasa-image-container">
                    <img src="${data.url}" alt="${data.title}" onerror="console.error('Failed to load NASA image:', this.src)">
                </div>
                <p class="nasa-description">${data.explanation}</p>
            `;
        }
    } catch (error) {
        console.error('Detailed error fetching NASA APOD:', error);
        const nasaContent = document.getElementById('nasa-content');
        if (nasaContent) {
            nasaContent.innerHTML = `<p class="error">Failed to load NASA's Picture of the Day: ${error.message}</p>`;
        }
    }
}

getWeather();
getISSLocation();
getSpaceInfo();
getNASAImage();

setInterval(() => {
    getWeather();
    getISSLocation();
    getSpaceInfo();
    getNASAImage();
}, 120000);
