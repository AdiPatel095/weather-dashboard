import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
const router = Router();
// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
    try {
        // TODO: GET weather data from city name
        const cityName: string = req.body.cityName;
        WeatherService.getWeatherForCity(cityName).then((data) => {
            // TODO: save city to search history
            HistoryService.addCity(cityName);
            res.json(data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});
// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
    HistoryService.getCities()
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
    try {
        const cityId: string = req.params.id; // Get the ID from URL params
        await HistoryService.removeCity(cityId); // Await the async function
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
