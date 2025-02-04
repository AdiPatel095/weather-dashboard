import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    city: string;
    date: string;
    tempF: number;
    windSpeed: number;
    humidity: number;
    icon: string;
    iconDescription: string;

    constructor(city: string, date: string, tempF: number, windSpeed: number, humidity: number, icon: string, iconDescription: string) {
        this.city = city;
        this.date = date;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.icon = icon;
        this.iconDescription = iconDescription;
    }
}

interface LocationData {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

interface WeatherResponse {
    dt: number;
    main: {
        temp: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        icon: string;
        description: string;
    }[];
    name?: string;
}

interface ForecastResponse {
    list: WeatherResponse[];
}

// TODO: Complete the WeatherService class
class WeatherService {
    baseURL: string;
    apiKey: string;

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
    async fetchLocationData(query: string): Promise<any> {
        const url: string = this.buildGeocodeQuery(query);
        const response: Response = await fetch(url);
        return response.json();
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData: any): LocationData {
        const { name, lat, lon, country, state } = locationData;
        return { name, lat, lon, country, state };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(query: string): string {
        return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates: LocationData): string {
        return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildForecastQuery(coordinates: LocationData): string {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(query: string): Promise<LocationData> {
        const locationData: any = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData[0]);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates: LocationData): Promise<any> {
        const url: string = this.buildWeatherQuery(coordinates);
        const response: Response = await fetch(url);
        return response.json();
    }
    // TODO: Create fetchWeatherData method
    async fetchForecastData(coordinates: LocationData): Promise<any> {
        const url: string = this.buildForecastQuery(coordinates);
        const responseForecast: Response = await fetch(url);
        return responseForecast.json();
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response: WeatherResponse): Weather {
        return new Weather(
            response.name || '',
            dayjs(response.dt * 1000).format("MM/DD/YYYY HH:mm:ss"),
            response.main.temp,
            response.wind.speed,
            response.main.humidity,
            response.weather[0].icon,
            response.weather[0].description
        );
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather: Weather, weatherData: WeatherResponse[]): Weather[] {
        const forecastArray: Weather[] = [currentWeather];
        const name: string = currentWeather.city;
        for (let i = 0; i < 40; i++) {
            if (i % 8 === 0) {
                const newDay = new Weather(
                    name,
                    dayjs(weatherData[i].dt * 1000).format("MM/DD/YYYY HH:mm:ss"),
                    weatherData[i].main.temp,
                    weatherData[i].wind.speed,
                    weatherData[i].main.humidity,
                    weatherData[i].weather[0].icon,
                    weatherData[i].weather[0].description
                );
                forecastArray.push(newDay);
            }
        }
        return forecastArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city: string): Promise<Weather[]> {
        const coordinates: LocationData = await this.fetchAndDestructureLocationData(city);
        const weatherResponse: any = await this.fetchWeatherData(coordinates);
        const currentWeather: Weather = this.parseCurrentWeather(weatherResponse);
        const forecastResponse: ForecastResponse = await this.fetchForecastData(coordinates);
        return this.buildForecastArray(currentWeather, forecastResponse.list);
    }
}
export default new WeatherService();
