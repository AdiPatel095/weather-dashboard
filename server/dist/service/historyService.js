import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile('db/searchHistory.json', { encoding: 'utf8' });
            return data.trim() || '[]'; // Ensure it's always a valid JSON array string
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return '[]'; // Return an empty array if the file doesn't exist
            }
            throw error;
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        return fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        try {
            const data = await this.read();
            const cities = JSON.parse(data);
            return Array.isArray(cities) ? cities : []; // Ensure it's always an array
        }
        catch {
            return []; // Return an empty array on JSON parse failure
        }
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        const cities = await this.getCities();
        const newCity = new City(city, uuidv4());
        cities.push(newCity);
        await this.write(cities);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();
