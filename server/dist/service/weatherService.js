import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, tempF, windSpeed, humidity, icon, iconDescription) {
        this.city = city;
        this.date = date;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.icon = icon;
        this.iconDescription = iconDescription;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    // private city = '';
    constructor() {
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    // * Note: The following methods are here as a guide, but you are welcome to provide your own solution.
    // * Just keep in mind the getWeatherForCity method is being called in your
    // * 09-Servers-and-APIs/02-Challenge/Develop/server/src/routes/api/weatherRoutes.ts file
    // * the array of Weather objects you are returning ultimately goes to
    // * 09-Servers-and-APIs/02-Challenge/Develop/client/src/main.ts
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const url = this.buildGeocodeQuery(query);
        const response = await fetch(url);
        return response.json();
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { name, lat, lon, country, state } = locationData;
        return { name, lat, lon, country, state };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(query) {
        return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildForecastQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(query) {
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData[0]);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await fetch(url);
        return await response.json();
    }
    // TODO: Create fetchWeatherData method
    async fetchForecastData(coordinates) {
        const url = this.buildForecastQuery(coordinates);
        const responseForecast = (await fetch(url)).json();
        return await responseForecast;
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        return new Weather(response.name, dayjs(response.dt * 1000).format("MM/DD/YYYY HH:mm:ss"), response.main.temp, response.wind.speed, response.main.humidity, response.weather[0].icon, response.weather[0].description);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = [currentWeather];
        const name = currentWeather.city;
        for (let i = 0; i < 40; i++) {
            if (i % 8 === 0) {
                const newDay = new Weather(name, dayjs(weatherData[i].dt * 1000).format("MM/DD/YYYY HH:mm:ss"), weatherData[i].main.temp, weatherData[i].wind.speed, weatherData[i].main.humidity, weatherData[i].weather[0].icon, weatherData[i].weather[0].description);
                forecastArray.push(newDay);
            }
        }
        return forecastArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherResponse = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherResponse);
        const forecastResponse = await this.fetchForecastData(coordinates);
        return this.buildForecastArray(currentWeather, forecastResponse.list);
    }
}
export default new WeatherService();
